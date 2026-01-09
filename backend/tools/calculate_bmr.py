def calculate_bmr(profile):
    if profile["sexe"] == "homme":
        return 10 * profile["poids"] + 6.25 * profile["taille"] - 5 * profile["age"] + 5
    return 10 * profile["poids"] + 6.25 * profile["taille"] - 5 * profile["age"] - 161
