from app.rules import (
    score_country,
    score_event_type,
    score_failed_attempts,
    score_request_abuse,
    score_time_anomaly,
)
from app.schemas import RiskRequest, RiskResponse


def level_from_score(score: int) -> str:
    if score >= 90:
        return "critico"
    if score >= 70:
        return "alto"
    if score >= 40:
        return "medio"
    return "bajo"


def analyze_event(event: RiskRequest) -> RiskResponse:
    score = 5
    reasons: list[str] = []

    for rule in (
        score_failed_attempts,
        score_time_anomaly,
        score_request_abuse,
        score_event_type,
        score_country,
    ):
        points, rule_reasons = rule(event)
        score += points
        reasons.extend(rule_reasons)

    score = max(0, min(score, 100))
    if not reasons:
        reasons.append("Evento dentro de parametros normales")

    return RiskResponse(
        riesgo=level_from_score(score),
        score=score,
        reasons=reasons,
    )

