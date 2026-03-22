from fastapi import APIRouter, Depends
from typing import List
import random
from app.api.endpoints.users import get_current_user_email
from app.mongo import farms_collection

router = APIRouter()

@router.get("/")
def get_live_sensors(current_user_email: str = Depends(get_current_user_email)):
    farm = farms_collection.find_one({"user_email": current_user_email})
    if not farm:
        return []

    plots = farm.get("total_plots", 0)
    sensors = []
    for i in range(1, plots + 1):
        sensors.append({
            "plot_index": i,
            "soil_moisture": round(random.uniform(20.0, 80.0), 1),
            "sunlight_uv": round(random.uniform(1.0, 11.0), 1),
            "water_reserve": round(random.uniform(10.0, 100.0), 1)
        })
    return sensors
