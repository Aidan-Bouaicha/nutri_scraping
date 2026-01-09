from pydantic import BaseModel

class NutritionProfile(BaseModel):
    taille: int
    poids: int
    age: int
    sexe: str
    objectif: str


class ChatRequest(BaseModel):
    message: str
    profile: NutritionProfile
