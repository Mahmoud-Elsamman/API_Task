import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Invoice from "./Invoice";
import InvoiceItem from "./InvoiceItem";

class Item extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "items",
    sequelize,
  }
);

export default Item;
