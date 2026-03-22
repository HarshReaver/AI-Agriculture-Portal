from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserProfileCreate(BaseModel):
    username: str

class FarmSetup(BaseModel):
    total_plots: int

class UserProfile(BaseModel):
    user_email: str
    username: str
    avatar_url: Optional[str] = None
    created_at: datetime
    
class FarmInfo(BaseModel):
    user_email: str
    total_plots: int
    rows: int
    cols: int
    created_at: datetime
    
class SetupResponse(BaseModel):
    profile: UserProfile
    farm: FarmInfo

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str
