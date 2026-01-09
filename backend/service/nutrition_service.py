def calculate_bmr(profile):
    if profile.sexe == "homme":
        return 10 * profile.poids + 6.25 * profile.taille - 5 * profile.age + 5
    return 10 * profile.poids + 6.25 * profile.taille - 5 * profile.age - 161


def calculate_calories(bmr, objectif):
    if objectif == "perte":
        return bmr - 300
    if objectif == "prise":
        return bmr + 300
    return bmr


def calculate_proteins(poids):
    return round(poids * 1.8, 1)
