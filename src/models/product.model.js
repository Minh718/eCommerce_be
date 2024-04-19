'use strict'

const mongoose = require('mongoose'); // Erase if already required
const slugify = require('slugify')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        required: true,
    },
    product_thump:{
        type:String,
        required:true,
    },
    product_description:{
        type:String,
    },
    product_type:{
        type: String,
        enum: ['Electronic', 'Clothing', 'Furniture'],
        required: true
    },
    product_slug: String,
    product_price: {
        type: Number,
        required: true
    },
    product_quatity: {
        type: Number,
        required: true
    },
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
    product_attributes: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    product_ratingsAver:{
        type: Number,
        default: 4.5,
        set: (val)=> Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublish: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
},
{
    timestamps: true,
    collection: COLLECTION_NAME
});

productSchema.index({product_name: 'text', product_description: 'text'})

productSchema.pre('save', function(next){
this.product_slug = slugify(this.product_name)
next()
})


const clothingSchema = new mongoose.Schema({
    brand: {type: String, required: true},
    size: String,
    material: String,
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
},
{
    collections: 'Clothings',
    timestamps: true
})


const electronicSchema = new mongoose.Schema({
    manufacturer: {type: String, required: true},
    model: String,
    color: String,
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    },
},
{
    collections: 'Electronics',
    timestamps: true
})

//Export the model
module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    clothing: mongoose.model('Clothing', clothingSchema),
    electronic: mongoose.model('Electronic', electronicSchema)
};