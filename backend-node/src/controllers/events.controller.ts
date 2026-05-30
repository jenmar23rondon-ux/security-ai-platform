import { Response } from "express";
import { Prisma } from "@prisma/client";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createEventSchema } from "../utils/validators";
import * as eventsService from "../services/events.service";

export async function listEvents(_req: AuthRequest, res: Response) {
  const events = await eventsService.listEvents();
  res.json(events);
}

export async function createEvent(req: AuthRequest, res: Response) {
  const data = createEventSchema.parse(req.body);
  const event = await eventsService.createEvent({
    ...data,
    metadata: data.metadata as Prisma.InputJsonValue | undefined
  });

  req.app.get("io")?.emit("security:event", event);
  res.status(201).json(event);
}
