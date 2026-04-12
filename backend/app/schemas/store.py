from pydantic import BaseModel

class StoreSettingsBase(BaseModel):
    is_busy_mode_active: bool
    base_prep_time_minutes: int

class StoreSettingsUpdate(StoreSettingsBase):
    pass

class StoreSettingsResponse(StoreSettingsBase):
    id: int
    model_config = {"from_attributes": True}
