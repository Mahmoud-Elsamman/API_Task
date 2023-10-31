import { Router } from "express";
import UserController from "../controllers/UserController";

const router = Router();

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.get("/", UserController.getAllUsers);

router.get("/:id", UserController.getUserById);

router.put("/:id", UserController.updateUser);

router.get("/getUserInvoices/:id", UserController.getUserInvoices);

export default router;
