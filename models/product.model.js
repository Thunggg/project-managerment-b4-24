const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,
  product_category_id: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  featured: String,
  status: String,
  position: Number,
  createdBy: String,
  updatedBy: String,
  deletedBy: String,
  deleted: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    slug: "title",
    unique: true // unique: true tạo ra slug duy nhất
  }
},{
  timestamps: true // Tự động thêm trường createdAt và updatedAt (https://mongoosejs.com/docs/timestamps.html)
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;