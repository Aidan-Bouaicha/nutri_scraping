import json
import requests
from config.ollama import OLLAMA_BASE_URL, OLLAMA_MODEL

from tools.calculate_bmr import calculate_bmr
from tools.estimate_macros import estimate_macros
from tools.search_foods import search_foods_tool
from tools.build_meal_plan import build_meal_plan


SYSTEM_PROMPT = """
Tu es un agent MCP strict.

RÈGLES :
- Tu ne fais aucun calcul
- Tu ne produis aucun chiffre
- Tu ne réponds jamais en texte libre
- Tu choisis UNIQUEMENT une action à effectuer

FORMAT STRICT :
{
  "action": "<action>",
  "arguments": { ... }
}

ACTIONS AUTORISÉES :
- get_user_nutrition_profile
- search_foods
- build_meal_plan
"""


def call_ollama(message):
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": f"{SYSTEM_PROMPT}\n\nMessage utilisateur : {message}",
        "stream": False,
        "options": {"temperature": 0}
    }

    r = requests.post(
        f"{OLLAMA_BASE_URL}/api/generate",
        json=payload,
        timeout=120
    )
    r.raise_for_status()

    return json.loads(r.json()["response"])


def run_mcp(message, profile):
    """
    Orchestration MCP stateful.
    """
    state = {}

    # 1️⃣ Profil nutritionnel
    step = call_ollama(message)
    if step["action"] != "get_user_nutrition_profile":
        raise ValueError("Première action MCP invalide")

    bmr = calculate_bmr(profile)
    calories = bmr
    macros = estimate_macros(profile, calories)

    state["macros"] = macros

    # 2️⃣ Recherche aliments
    step = call_ollama("Recherche des aliments adaptés")
    if step["action"] != "search_foods":
        raise ValueError("Deuxième action MCP invalide")

    foods = search_foods_tool("poulet")
    state["foods"] = foods

    # 3️⃣ Construction du plan
    step = call_ollama("Construis le plan de repas")
    if step["action"] != "build_meal_plan":
        raise ValueError("Troisième action MCP invalide")

    meal_plan = build_meal_plan(profile, state["macros"], state["foods"])

    return {
        "profil": profile,
        "macros": macros,
        "repas": meal_plan
    }
