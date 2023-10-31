import { Request, Response } from "express";
import Invoice from "../models/Invoice";
import Item from "../models/Item";
import User from "../models/User";

type InvoiceRequest = {
  userId: string;
  status: "Placed" | "Delivered" | "Cancelled";
  items: [{ itemId: number; quantity: number }];
};

class InvoiceController {
  public async createInvoice(req: Request, res: Response) {
    const { userId, status, items }: InvoiceRequest = req.body;

    try {
      let totalAmount = 0;
      let itemList: { item: Item; quantity: any; unitPrice: number }[] = [];
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      for (const itemData of items) {
        const { itemId, quantity } = itemData;
        const dbItem = await Item.findByPk(itemId);
        if (!dbItem) {
          return res
            .status(400)
            .json({ message: `Item with ID ${itemId} does not exist.` });
        }
        const unitPrice = dbItem.price * quantity;
        totalAmount += unitPrice;

        const newItem = {
          item: dbItem,
          quantity,
          unitPrice,
        };

        itemList.push(newItem);
      }

      const newInvoice = await Invoice.create(
        { status, totalAmount, userId },
        {
          include: [
            {
              model: Item,
              as: "items",
            },
          ],
        }
      );

      //@ts-ignore
      await user.addInvoice(newInvoice);

      for (const item of itemList) {
        const { quantity, unitPrice } = item;
        //@ts-ignore
        await newInvoice.addItem(item.item, {
          through: { quantity, unitPrice },
        });
      }
      res.status(201).json(newInvoice);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public async getAllInvoices(req: Request, res: Response) {
    try {
      const invoices = await Invoice.findAll({
        include: [
          {
            model: Item,
            as: "items",
          },
        ],
      });
      res.status(200).json(invoices);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve invoices" });
    }
  }

  public async getInvoiceById(req: Request, res: Response) {
    const invoiceId = req.params.id;

    try {
      const invoice = await Invoice.findByPk(invoiceId, {
        include: [
          {
            model: Item,
            as: "items",
          },
        ],
      });
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.status(200).json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve invoice" });
    }
  }

  public async updateInvoice(req: Request, res: Response) {
    const invoiceId = req.params.id;
    const invoiceData: Invoice = req.body;

    try {
      const invoice = await Invoice.findByPk(invoiceId, {
        include: [
          {
            model: Item,
            as: "items",
          },
        ],
      });
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }

      await invoice.update(invoiceData);
      res.status(200).json({ message: "Invoice updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update invoice" });
    }
  }

  public async deleteInvoice(req: Request, res: Response) {
    const invoiceId = req.params.id;

    try {
      const invoice = await Invoice.findByPk(invoiceId, {
        include: [
          {
            model: Item,
            as: "items",
          },
        ],
      });
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }

      await invoice.destroy();
      res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete invoice" });
    }
  }
}

export default new InvoiceController();
