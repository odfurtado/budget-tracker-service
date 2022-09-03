import PaymentType from '../../../../domain/entity/PaymentType';
import PaymentTypeRepository from '../../../../domain/repository/PaymentTypeRepository';

export default class PaymentTypeRepositoryMemory
	implements PaymentTypeRepository
{
	paymentTypes: PaymentType[];

	constructor() {
		this.paymentTypes = [];
		this.paymentTypes.push(new PaymentType('Credit Card'));
		this.paymentTypes.push(new PaymentType('Debit Card'));
		this.paymentTypes.push(new PaymentType('PIX'));
		this.paymentTypes.push(new PaymentType('MONEY'));
	}

	async list(): Promise<PaymentType[]> {
		return this.paymentTypes;
	}
}
