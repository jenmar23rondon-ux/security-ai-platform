from fastapi import FastAPI

from app.risk_model import analyze_event
from app.schemas import RiskRequest, RiskResponse

app = FastAPI(title="Security AI Service", version="1.0.0")


@app.get("/")
def health():
    return {"name": "Security AI Service", "status": "ok"}


@app.post("/analyze", response_model=RiskResponse)
def analyze(payload: RiskRequest):
    return analyze_event(payload)

