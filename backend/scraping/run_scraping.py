import json
from scraping.openfoodfacts_scraper import fetch_products
from scraping.normalize import normalize_products
from scraping.config import OUTPUT_JSON


def run():
    print("=== SCRAPING OPENFOODFACTS ===")

    raw_products = fetch_products()
    print(f"[INFO] Total produits bruts : {len(raw_products)}")

    foods = normalize_products(raw_products)
    print(f"[INFO] Produits normalisés : {len(foods)}")

    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(foods, f, indent=2, ensure_ascii=False)

    print(f"[OK] Données écrites dans : {OUTPUT_JSON.resolve()}")
    print("=== FIN SCRAPING ===")


if __name__ == "__main__":
    run()
