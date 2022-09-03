import { Schema } from "mongoose";
import Entry from "../../../../../domain/entity/Entry";

const EntrySchema = new Schema<Entry>({
  id: { type: String, required: true, index: true },
  dashboard: { type: String, required: true, index: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  paymentType: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: Number, required: true, index: true },
  year: { type: Number, required: true, index: true }
});

export default EntrySchema;
