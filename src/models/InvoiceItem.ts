import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

const InvoiceItem = sequelize.define("InvoiceItem", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default InvoiceItem;
