import mongoose from 'mongoose';
import PaymentType from '../../../../domain/entity/PaymentType';
import PaymentTypeRepository from '../../../../domain/repository/PaymentTypeRepository';
import PaymentTypeSchema from './model/PaymentTypeModel';

export default class PaymentTypeRepositoryMongoDB
	implements PaymentTypeRepository
{
	private readonly PaymentTypeModel;
	constructor(readonly connection: mongoose.Connection) {
		this.PaymentTypeModel = this.connection.model<PaymentType>(
			'PaymentType',
			PaymentTypeSchema
		);
	}

	async list(): Promise<PaymentType[]> {
		var paymentTypes = await this.PaymentTypeModel.find();
		return paymentTypes.map(
			(paymentType) => new PaymentType(paymentType.name, paymentType.id)
		);
	}
}
