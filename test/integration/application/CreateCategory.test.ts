import CreateCategory from '../../../src/application/CreateCategory';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';
import DataGenerator from '../../dataGenerator/DataGenerator';

describe('UseCase.CreateCategory', () => {
	let repositoryFactory: RepositoryFactory;
	let given: DataGenerator;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
		given = new DataGenerator(repositoryFactory);
	});

	test('Should create a category from dashboard', async () => {
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: 'user@mail.com',
			},
			dashboard: 'userId-1111',
			name: 'My Category',
		};
		let output = await new CreateCategory(repositoryFactory).execute(input);
		expect(output.id).not.toBeNull();
		let categories = await repositoryFactory
			.createCategoryRepository()
			.list(input.dashboard);
		expect(categories).toHaveLength(1);
		expect(categories[0].id).toBe(output.id);
		expect(categories[0].dashboard).toBe(input.dashboard);
		expect(categories[0].name).toBe(input.name);
	});

	test('Should create a category from dashboard shared', async () => {
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
			name: 'My Category',
		};
		let output = await new CreateCategory(repositoryFactory).execute(input);
		expect(output.id).not.toBeNull();
		let categories = await repositoryFactory
			.createCategoryRepository()
			.list(input.dashboard);
		expect(categories).toHaveLength(1);
		expect(categories[0].id).toBe(output.id);
		expect(categories[0].dashboard).toBe(input.dashboard);
		expect(categories[0].name).toBe(input.name);
	});

	test('Cannot create a category from dashboard that is not shared', async () => {
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: 'anotheruser@mail.com',
			},
			dashboard: 'userId-1111',
			name: 'My Category',
		};
		await expect(
			new CreateCategory(repositoryFactory).execute(input)
		).rejects.toThrow('Invalid access');
	});
});
