import GetPaymentTypes from '../../../application/GetPaymentTypes';
import RepositoryFactory from '../../../domain/repository/RepositoryFactory';
import Http from '../http/Http';

export default class PaymentTypeController {
	constructor(private repositoryFactory: RepositoryFactory) {}

	list = async () => {
		let output = await new GetPaymentTypes(this.repositoryFactory).execute();
		return output.paymentTypes;
	};

	public bind(http: Http) {
		http.on('get', '/paymenttypes', this.list);
	}
}
