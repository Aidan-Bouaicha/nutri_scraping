import requests
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
        r = requests.post(
            f"{OLLAMA_BASE_URL}/api/chat",
            json={
                "model": OLLAMA_MODEL,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "stream": False,
                "options": {
                    "temperature": 0.3,
                },
            },
            timeout=60,
        )
        r.raise_for_status()

        response = r.json()["message"]["content"].strip()

    except Exception as e:
        print("ERREUR OLLAMA :", e)
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
