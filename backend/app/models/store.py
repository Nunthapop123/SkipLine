from sqlalchemy import Column, Integer, Boolean
from app.core.database import Base

class StoreSettings(Base):
    __tablename__ = "store_settings"

    id = Column(Integer, primary_key=True, index=True, default=1)
    is_busy_mode_active = Column(Boolean, default=False)
    base_prep_time_minutes = Column(Integer, default=5)
