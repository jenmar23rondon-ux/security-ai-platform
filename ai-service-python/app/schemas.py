from typing import Literal

from pydantic import BaseModel, Field


class RiskRequest(BaseModel):
    ip: str
    hour: int = Field(ge=0, le=23)
    failedAttempts: int = Field(default=0, ge=0)
    requestCount: int = Field(default=0, ge=0)
    eventType: str
    country: str | None = None


class RiskResponse(BaseModel):
    riesgo: Literal["bajo", "medio", "alto", "critico"]
    score: int = Field(ge=0, le=100)
    reasons: list[str]
    model: str = "rules-v1"

