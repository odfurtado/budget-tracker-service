import PaymentTypeController from '../../../../../src/infra/in/controller/PaymentTypeController';
import MemoryRepositoryFactory from '../../../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

describe('Controller.PaymentTypeController', () => {
	test('Should list all payment types', async () => {
		let repositoryFactory = new MemoryRepositoryFactory();
		let paymentTypeController = new PaymentTypeController(repositoryFactory);
		let result = await paymentTypeController.list();
		expect(result).toHaveLength(4);
	});
});
