'use strict'

const { BadRequestError } = require("../core/error.response");
const InventoryRepo = require("../repositories/inventory.repo");

class InventoryService {
    static recoverReservationProducts({products, cart_id}){
        for (let i = 0; i < products.length; i++) {
            const {product_id, quantity} = products[i];
                InventoryRepo.recoverReservationProduct({product_id, quantity, cart_id})
            // if(!recover.modifiedCount) throw new BadRequestError("error order")
        }   
    }
}
module.exports =  InventoryService