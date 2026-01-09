import requests
import json
import traceback
from config.ollama import OLLAMA_BASE_URL, OLLAMA_MODEL
from service.nutrition_service import (
    calculate_bmr,
    calculate_calories,
    calculate_proteins,
)


def run_chat(profile, message: str) -> dict:
    """
    Chatbot nutrition flexible (V1 stable)
    """

    # 🔢 Contexte calculé côté backend
    bmr = calculate_bmr(profile)
    calories = calculate_calories(bmr, profile.objectif)
    proteins = calculate_proteins(profile.poids)

    prompt = f"""
Tu es un chatbot conversationnel spécialisé en alimentation et nutrition sportive.

Tu peux :
- proposer des repas (petit-déjeuner, déjeuner, dîner)
- proposer un plan pour une journée ou une semaine
- donner des conseils nutritionnels

RÈGLES :
- Réponds UNIQUEMENT dans le domaine alimentation / sport
- Si la question est hors sujet, dis-le poliment
- Adapte précisément ta réponse à la demande

CONTEXTE UTILISATEUR :
- Calories estimées : {calories} kcal / jour
- Protéines estimées : {proteins} g / jour

QUESTION UTILISATEUR :
{message}

Réponse :
"""

    try:
        # quick connectivity check
        try:
            ping = requests.get(OLLAMA_BASE_URL, timeout=5)
            print(f"OLLAMA CONNECTIVITY: {OLLAMA_BASE_URL} -> {ping.status_code}")
        except Exception as e:
            print("OLLAMA CONNECTIVITY CHECK FAILED:", repr(e))

        payload = {
            "model": OLLAMA_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "stream": False,
            "options": {"temperature": 0.3},
        }

        print("OLLAMA REQUEST PAYLOAD:", json.dumps(payload)[:2000])

        r = requests.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload, timeout=60)
        print("OLLAMA HTTP STATUS:", r.status_code)
        text_preview = (r.text[:2000] + "...") if len(r.text) > 2000 else r.text
        print("OLLAMA RESPONSE TEXT:", text_preview)

        r.raise_for_status()

        try:
            data = r.json()
        except Exception as e:
            print("OLLAMA JSON DECODE ERROR:", repr(e))
            print("RAW RESPONSE:", r.text)
            raise

        # Ollama responses can have different shapes depending on version.
        response = None
        if "choices" in data and isinstance(data["choices"], list) and data["choices"]:
            choice = data["choices"][0]
            msg = choice.get("message") or choice.get("content")
            if isinstance(msg, dict):
                response = msg.get("content")
            elif isinstance(msg, str):
                response = msg
        elif "message" in data and isinstance(data["message"], dict):
            response = data["message"].get("content")
        elif "content" in data and isinstance(data["content"], str):
            response = data.get("content")

        if not response:
            print("OLLAMA RESPONSE UNEXPECTED:", data)
            response = "Je n'ai pas réussi à récupérer la réponse de l'IA."
        else:
            response = response.strip()

    except Exception as e:
        print("ERREUR OLLAMA :", repr(e))
        traceback.print_exc()
        response = (
            "Je rencontre actuellement un problème technique "
            "et je ne peux pas répondre correctement pour le moment."
        )

    return {
        "profil": profile,
        "macros": {
            "calories": calories,
            "proteines": proteins,
        },
        "repas": {},
        "explication": response,
    }
