import GetCategories from '../../../src/application/GetCategories';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';
import DataGenerator from '../../dataGenerator/DataGenerator';

describe('UseCase.GetCategories', () => {
	let repositoryFactory: RepositoryFactory;
	let given: DataGenerator;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
		given = new DataGenerator(repositoryFactory);
		given.systemCategory('Salary');
		given.systemCategory('Home');
		given.systemCategory('Car');
	});

	test('Should list all categories from dashboard', async () => {
		given.dashboard('userId-1111').category('User category 1');
		given.dashboard('userId-2222').category('User Category 2');
		let getCategories = new GetCategories(repositoryFactory);
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: '',
			},
			dashboard: 'userId-1111',
		};
		let output = await getCategories.execute(input);
		expect(output).not.toBeNull();
		expect(output.categories).not.toBeUndefined();
		expect(output.categories).not.toBeNull();
		expect(output.categories).toHaveLength(4);
	});

	test('Should list all categories from dashboard shared', async () => {
		given.dashboard('userId-1111').category('User category 1');
		given.dashboard('userId-2222').category('User category 2');
		given.dashboard('userId-2222').category('User category 3');
		given
			.dashboard('userId-1111')
			.approvedShareWith('user02@mail.com', 'userId-2222');
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: 'user02@mail.com',
			},
			dashboard: 'userId-1111',
		};
		let output = await new GetCategories(repositoryFactory).execute(input);
		expect(output).not.toBeNull();
		expect(output.categories).not.toBeUndefined();
		expect(output.categories).not.toBeNull();
		expect(output.categories).toHaveLength(4);
	});

	test('Cannot list all categories from dashboard that is not shared', async () => {
		given.dashboard('userId-1111').category('User category 1');
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: 'user02@mail.com',
			},
			dashboard: 'userId-1111',
		};
		await expect(
			new GetCategories(repositoryFactory).execute(input)
		).rejects.toThrow('Invalid access');
	});
});
