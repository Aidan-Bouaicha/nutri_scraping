from pydantic import BaseModel
from typing import Optional

class Food(BaseModel):
    id: Optional[str]
    nom: str
    calories: Optional[float]
    proteines: Optional[float]
    glucides: Optional[float]
    lipides: Optional[float]
    source: str
