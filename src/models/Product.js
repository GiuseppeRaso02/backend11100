import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, default: "UNDR/GRD", trim: true },
    category: {
      type: String,
      enum: ["Hoodie", "Tee", "Pants", "Footwear", "Outerwear", "Accessories"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    image: { type: String, default: "" }, // URL Cloudinary
    imagePublicId: { type: String, default: "" }, // per delete
    stock: { type: Number, default: 0, min: 0 },
    sizes: [{ type: String }],
    drop: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
