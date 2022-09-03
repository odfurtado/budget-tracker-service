import GetPaymentTypes from '../../../src/application/GetPaymentTypes';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

let repositoryFactory: RepositoryFactory;
beforeEach(() => {
	repositoryFactory = new MemoryRepositoryFactory();
});

test('Should list all paymentType', async () => {
	let getPaymentTypes = new GetPaymentTypes(repositoryFactory);
	let output = await getPaymentTypes.execute();
	expect(output).not.toBeNull();
	expect(output.paymentTypes).not.toBeUndefined();
	expect(output.paymentTypes).not.toBeNull();
	expect(output.paymentTypes).toHaveLength(4);
});
