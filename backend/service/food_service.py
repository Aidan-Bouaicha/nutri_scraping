import json
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "foods.json"

def search_foods(query: str):
    with open(DATA_PATH, encoding="utf-8") as f:
        foods = json.load(f)

    q = query.lower()
    return [f for f in foods if q in f["nom"].lower()][:20]
