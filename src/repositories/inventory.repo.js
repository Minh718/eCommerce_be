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

    static async recoverReservationProduct ({product_id, quantity, cart_id}){
        const filter = {
            inventory_product_id: product_id

        }, update = {
            $pull: {
                    inventory_reservations: {
                            quantity,
                            cart_id,
                            status: "isPending"
                        }
                    },
            $inc: {
                inventory_stock: quantity
            }
            }

             return inventory.updateOne(filter, update)
                
            }

        static async confirmReservation ({product_id, quantity, cart_id}){
            const filter = {
                inventory_product_id: product_id,
                'inventory_reservations.quantity': quantity,
                'inventory_reservations.cart_id': cart_id,
                'inventory_reservations.status': 'isPending',
    
            }, update = {
                'inventory_reservations.$.status': 'success'
                }
    
                    return   inventory.updateOne(filter, update)
                    
                }
    static async checkEnoughProduct ({product_id, quantity, cart_id}){
        console.log({product_id, quantity, cart_id})
        const filter = {
            inventory_product_id: product_id,
            inventory_stock: {$gte: quantity}
        }, update = {
            $inc: {
                inventory_stock: -quantity
            },
            $push: {
                    inventory_reservations: {
                            quantity,
                            cart_id,
                            createOn: new Date(),
                            status: 'isPending'
                        }
                    }
                }
                
                return await inventory.updateOne(filter, update)
                
            }
}

module.exports = InventoryRepo