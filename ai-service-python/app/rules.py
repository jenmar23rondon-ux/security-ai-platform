from app.schemas import RiskRequest


def score_failed_attempts(event: RiskRequest) -> tuple[int, list[str]]:
    if event.failedAttempts >= 15:
        return 40, ["Muchos intentos fallidos en corto tiempo"]
    if event.failedAttempts >= 10:
        return 30, ["Mas de 10 intentos fallidos"]
    if event.failedAttempts >= 5:
        return 18, ["Patron de intentos fallidos"]
    return 0, []


def score_time_anomaly(event: RiskRequest) -> tuple[int, list[str]]:
    if 0 <= event.hour <= 4:
        return 18, ["Actividad en horario atipico"]
    return 0, []


def score_request_abuse(event: RiskRequest) -> tuple[int, list[str]]:
    if event.requestCount >= 150:
        return 32, ["Volumen de requests muy alto"]
    if event.requestCount >= 80:
        return 22, ["Posible abuso de API"]
    if event.requestCount >= 40:
        return 12, ["Requests por encima de lo normal"]
    return 0, []


def score_event_type(event: RiskRequest) -> tuple[int, list[str]]:
    weights = {
        "login_failed": (15, "Login fallido"),
        "unknown_ip": (20, "IP desconocida"),
        "geo_anomaly": (24, "Anomalia geografica"),
        "api_abuse": (25, "Abuso de API"),
        "suspicious_activity": (28, "Actividad sospechosa")
    }
    score, reason = weights.get(event.eventType, (0, ""))
    return score, [reason] if reason else []


def score_country(event: RiskRequest) -> tuple[int, list[str]]:
    high_watch = {"unknown", "tor", "proxy"}
    if event.country and event.country.lower() in high_watch:
        return 18, ["Origen marcado como proxy o desconocido"]
    return 0, []

