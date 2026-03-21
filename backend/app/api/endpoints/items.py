from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_items():
    return [{"name": "Wheat", "status": "Healthy"}, {"name": "Corn", "status": "Needs Water"}]
