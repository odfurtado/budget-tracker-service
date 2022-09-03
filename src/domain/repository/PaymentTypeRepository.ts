import PaymentType from '../entity/PaymentType';

export default interface PaymentTypeRepository {
	list(): Promise<PaymentType[]>;
}
