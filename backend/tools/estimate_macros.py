def estimate_macros(profile, calories):
    proteines = profile["poids"] * 1.8
    lipides = calories * 0.3 / 9
    glucides = (calories - (proteines * 4 + lipides * 9)) / 4

    return {
        "proteines": round(proteines, 1),
        "lipides": round(lipides, 1),
        "glucides": round(glucides, 1),
    }
