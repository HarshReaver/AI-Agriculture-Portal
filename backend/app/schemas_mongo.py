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
    plot_index: int = 0

class CropData(CropDataCreate):
    id: str
    user_email: str
    created_at: datetime
    is_active: bool = True
    analytics: dict | None = None

    class Config:
        from_attributes = True
