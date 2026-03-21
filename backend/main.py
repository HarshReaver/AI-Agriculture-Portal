import uvicorn
from app.database import engine, Base
import app.models  # Important: Must import models to register tables

Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    uvicorn.run("app.api.main:app", host="0.0.0.0", port=8000, reload=True)
