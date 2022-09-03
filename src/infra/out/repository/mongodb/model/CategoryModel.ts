import { Schema } from "mongoose";
import Category from "../../../../../domain/entity/Category";

const CategorySchema = new Schema<Category>({
  id: { type: String, required: true, index: true },
  dashboard: { type: String, index: true },
  name: { type: String, required: true }
});

export default CategorySchema;
