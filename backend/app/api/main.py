from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import items, auth, crops
from app.core.config import settings
from app.middleware.cors import setup_cors

app = FastAPI(title=settings.PROJECT_NAME)

# Set up CORS
setup_cors(app)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(crops.router, prefix="/api/crops", tags=["crops"])
app.include_router(items.router, prefix="/api/items", tags=["items"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Agriculture Portal API"}
