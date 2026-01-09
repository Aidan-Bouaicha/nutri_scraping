from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_JSON = BASE_DIR / "data" / "foods.json"

API_URL = "https://world.openfoodfacts.org/cgi/search.pl"

PAGE_SIZE = 50          # volontairement plus petit
MAX_PAGES = 30          # ~1500 produits (stable)
REQUEST_DELAY = 2.0     # respect serveur

TIMEOUT = 60            # timeout long
MAX_RETRIES = 3         # retry par page

USER_AGENT = "NutriAI/1.0 (educational project)"
