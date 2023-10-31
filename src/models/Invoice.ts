import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import User from "./User";
import Item from "./Item";
import InvoiceItem from "./InvoiceItem";

class Invoice extends Model {
  public id!: number;
  public totalAmount!: number;
  public userId!: number;
  public status!: "Placed" | "Delivered" | "Cancelled";
}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("Placed", "Delivered", "Cancelled"),
      allowNull: false,
    },
  },
  {
    tableName: "invoices",
    sequelize,
  }
);

Invoice.belongsToMany(Item, {
  through: InvoiceItem,
  foreignKey: "invoiceId",
  otherKey: "itemId",
  as: "items",
});

Item.belongsToMany(Invoice, {
  through: InvoiceItem,
  foreignKey: "itemId",
  otherKey: "invoiceId",
  as: "invoices",
});

export default Invoice;
