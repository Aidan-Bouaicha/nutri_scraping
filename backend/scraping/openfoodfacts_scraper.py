import time
import requests
from scraping.config import (
    API_URL,
    PAGE_SIZE,
    MAX_PAGES,
    REQUEST_DELAY,
    TIMEOUT,
    MAX_RETRIES,
    USER_AGENT,
)

HEADERS = {
    "User-Agent": USER_AGENT
}


def fetch_products():
    all_products = []

    for page in range(1, MAX_PAGES + 1):
        print(f"[INFO] Page {page}/{MAX_PAGES}")

        params = {
            "search_simple": 1,
            "action": "process",
            "json": 1,
            "page_size": PAGE_SIZE,
            "page": page,
            "fields": "id,product_name,nutriments",
        }

        success = False

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                response = requests.get(
                    API_URL,
                    params=params,
                    headers=HEADERS,
                    timeout=TIMEOUT,
                )
                response.raise_for_status()

                data = response.json()
                products = data.get("products", [])

                print(f"  ↳ {len(products)} produits reçus")
                all_products.extend(products)

                success = True
                break

            except requests.exceptions.RequestException as e:
                print(f"  ⚠️ Tentative {attempt}/{MAX_RETRIES} échouée : {e}")
                time.sleep(REQUEST_DELAY * attempt)

        if not success:
            print(f"  ❌ Page {page} ignorée après {MAX_RETRIES} échecs")

        time.sleep(REQUEST_DELAY)

    return all_products
