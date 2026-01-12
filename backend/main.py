from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.chat import router as chat_router
from api.nutrition import router as nutrition_router
from api.foods import router as foods_router

app = FastAPI(title="NutriAI Backend V1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(nutrition_router)
app.include_router(chat_router)
app.include_router(foods_router)
