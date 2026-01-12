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
    Chatbot nutrition flexible (optimisé pour rapidité)
    """

    # 🔢 Contexte calculé côté backend
    bmr = calculate_bmr(profile)
    calories = calculate_calories(bmr, profile.objectif)
    proteins = calculate_proteins(profile.poids)

    # Prompt court et optimisé
    prompt = f"""Tu es un expert nutrition. Réponds brièvement (2-3 phrases max).

Infos utilisateur: {calories} kcal/jour, {proteins}g protéines/jour

Question: {message}

Réponds directement:"""

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
            "options": {
                "temperature": 0.3,
                "num_predict": 150,  # Limite à 150 tokens pour plus de rapidité
            },
        }

        print("OLLAMA REQUEST PAYLOAD:", json.dumps(payload)[:2000])

        # Timeout réduit à 60s au lieu de 120s
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

    except requests.Timeout:
        print("TIMEOUT OLLAMA - Réponse trop lente")
        response = "La réponse de l'IA a pris trop de temps. Essayez avec une question plus courte."
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
