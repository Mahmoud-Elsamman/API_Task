import { Request, Response } from "express";
// import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import User from "../models/User";
import Invoice from "../models/Invoice";
import Item from "../models/Item";

class UserController {
  public async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const userWithEmail = await User.findOne({ where: { email } });
      if (userWithEmail) {
        return res.status(500).json({ error: "Email already used before." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: "User registration failed" });
    }
  }

  public async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: "Authentication failed" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Authentication failed" });
      }

      res.status(200).json({ userId: user.id });
    } catch (error) {
      res.status(500).json({ error: "Authentication failed" });
    }
  }

  public async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.findAll({
        include: [
          {
            model: Invoice,
            as: "invoices",
            include: [
              {
                model: Item,
                as: "items",
                through: { attributes: ["quantity", "unitPrice"] },
              },
            ],
          },
        ],
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve users" });
    }
  }

  public async getUserById(req: Request, res: Response) {
    const userId = req.params.id;

    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Invoice,
            as: "invoices",
            include: [
              {
                model: Item,
                as: "items",
                through: { attributes: ["quantity", "unitPrice"] },
              },
            ],
          },
        ],
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve user" });
    }
  }

  public async updateUser(req: Request, res: Response) {
    const userId = req.params.id;
    const userData = req.body;

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.update(userData);
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  }

  public async getUserInvoices(req: Request, res: Response) {
    const userId = req.params.id;

    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Invoice,
            as: "invoices",
            include: [
              {
                model: Item,
                as: "items",
                through: { attributes: ["quantity", "unitPrice"] },
              },
            ],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve user invoices" });
    }
  }
}

export default new UserController();
