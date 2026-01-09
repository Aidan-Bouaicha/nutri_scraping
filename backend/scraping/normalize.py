def normalize_product(p):
    name = p.get("product_name")
    nutr = p.get("nutriments", {})

    if not name:
        return None

    return {
        "id": p.get("id"),
        "nom": name.strip(),
        "calories": nutr.get("energy-kcal_100g"),
        "proteines": nutr.get("proteins_100g"),
        "glucides": nutr.get("carbohydrates_100g"),
        "lipides": nutr.get("fat_100g"),
        "source": "OpenFoodFacts",
    }


def normalize_products(products):
    normalized = []

    for p in products:
        food = normalize_product(p)
        if food:
            normalized.append(food)

    return normalized
