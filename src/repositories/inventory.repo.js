const { inventory } = require("../models/inventory.model")


class InventoryRepo {
    static async insertInventory({product_id, shop_id, stock, location = "where"}){
        return inventory.create({
            inventory_location: location,
            inventory_product_id: product_id,
            inventory_shop_id: shop_id,
            inventory_stock: stock
        })
    }
}

module.exports = InventoryRepo