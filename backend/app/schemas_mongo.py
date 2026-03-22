from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CropDataCreate(BaseModel):
    crop_type: str
    nitrogen_n: float
    phosphorus_p: float
    potassium_k: float
    temperature: float
    humidity: float
    rainfall: float
    ph_level: Optional[float] = None

class CropData(CropDataCreate):
    id: str
    user_email: str
    created_at: datetime

    class Config:
        from_attributes = True
