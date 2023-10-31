import { Request, Response } from "express";
import Item from "../models/Item";

class ItemController {
  public async createItem(req: Request, res: Response) {
    const itemData: { name: string; price: number } = req.body;

    try {
      const item = await Item.create(itemData);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to create item" });
    }
  }

  public async getAllItems(req: Request, res: Response) {
    try {
      const items = await Item.findAll();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve items" });
    }
  }

  public async getItemById(req: Request, res: Response) {
    const itemId = req.params.id;

    try {
      const item = await Item.findByPk(itemId);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve item" });
    }
  }

  public async updateItem(req: Request, res: Response) {
    const itemId = req.params.id;
    const itemData = req.body;

    try {
      const item = await Item.findByPk(itemId);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      await item.update(itemData);
      res.status(200).json({ message: "Item updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update item" });
    }
  }

  public async deleteItem(req: Request, res: Response) {
    const itemId = req.params.id;

    try {
      const item = await Item.findByPk(itemId);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      await item.destroy();
      res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete item" });
    }
  }
}

export default new ItemController();
