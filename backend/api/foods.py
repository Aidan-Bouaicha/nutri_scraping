from fastapi import APIRouter
from service.food_service import search_foods

router = APIRouter(prefix="/foods", tags=["Foods"])

@router.get("/search")
def search(query: str):
    return search_foods(query)
