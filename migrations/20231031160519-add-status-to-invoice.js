"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Invoices", "status", {
      type: Sequelize.ENUM("Placed", "Delivered", "Cancelled"),
      allowNull: false,
      defaultValue: "Placed",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Invoices", "status");
  },
};
