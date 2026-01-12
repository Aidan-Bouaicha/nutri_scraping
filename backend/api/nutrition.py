from fastapi import APIRouter
from schemas.nutrition import NutritionProfile
from service.nutrition_service import (
    calculate_bmr,
    calculate_calories,
    calculate_proteins,
)

router = APIRouter(prefix="/nutrition", tags=["Nutrition"])

@router.post("/profile")
def compute_profile(profile: NutritionProfile):
    bmr = calculate_bmr(profile)
    calories = calculate_calories(bmr, profile.objectif)
    proteins = calculate_proteins(profile.poids)

    return {
        "profil": profile,
        "bmr": bmr,
        "calories_journalieres": calories,
        "besoins_proteiques": proteins,
    }
