import { Schema } from "mongoose";
import PaymentType from "../../../../../domain/entity/PaymentType";

const PaymentTypeSchema = new Schema<PaymentType>({
  id: { type: String, required: true, index: true },
  name: { type: String, required: true }
});

export default PaymentTypeSchema;
