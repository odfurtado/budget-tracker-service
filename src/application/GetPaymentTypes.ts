import PaymentType from '../domain/entity/PaymentType';
import PaymentTypeRepository from '../domain/repository/PaymentTypeRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class GetPaymentTypes {
	private paymentTypeRepository: PaymentTypeRepository;
	constructor(repositoryFactory: RepositoryFactory) {
		this.paymentTypeRepository =
			repositoryFactory.createPaymentTypeRepository();
	}

	async execute(): Promise<Output> {
		let paymentTypes = await this.paymentTypeRepository.list();
		return {
			paymentTypes,
		};
	}
}

type Output = {
	paymentTypes: PaymentType[];
};
