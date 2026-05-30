import { Router } from "express";
import * as usersController from "../controllers/users.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/roles.middleware";

export const usersRoutes = Router();

usersRoutes.use(requireAuth, requireRole("admin"));
usersRoutes.get("/", usersController.listUsers);
usersRoutes.post("/", usersController.createUser);

