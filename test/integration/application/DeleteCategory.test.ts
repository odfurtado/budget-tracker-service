import DeleteCategory from '../../../src/application/DeleteCategory';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';
import DataGenerator from '../../dataGenerator/DataGenerator';

describe('UseCase.DeleteCategory', () => {
	let repositoryFactory: RepositoryFactory;
	let given: DataGenerator;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
		given = new DataGenerator(repositoryFactory);
	});

	test('Cannot delete system category', async () => {
		let systemCategoryId = given.systemCategory('User category 1');
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: 'user@mail.com',
			},
			dashboard: 'userId-1111',
			category: systemCategoryId,
		};
		await expect(
			new DeleteCategory(repositoryFactory).execute(input)
		).rejects.toThrow('Category not found');
	});

	test('Should delete a category from dashboard', async () => {
		let dashboard = 'userId-1111';
		let userCategoryId = given
			.dashboard(dashboard)
			.category('User Category 1');
		let input = {
			user: {
				id: dashboard,
				name: '',
				email: 'user@mail.com',
			},
			dashboard,
			category: userCategoryId,
		};
		await new DeleteCategory(repositoryFactory).execute(input);
		let categories = await repositoryFactory
			.createCategoryRepository()
			.list(dashboard);
		expect(categories).toHaveLength(0);
	});

	test('Should delete a category from dashboard shared', async () => {
		let dashboard = 'userId-1111';
		let userCategoryId = given
			.dashboard(dashboard)
			.category('User Category 1');
		given
			.dashboard(dashboard)
			.approvedShareWith('user02@mail.com', 'userId-2222');
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: 'user02@mail.com',
			},
			dashboard: dashboard,
			category: userCategoryId,
		};
		await new DeleteCategory(repositoryFactory).execute(input);
		let categories = await repositoryFactory
			.createCategoryRepository()
			.list(dashboard);
		expect(categories).toHaveLength(0);
	});

	test('Cannot delete a category from dashboard that is not shared', async () => {
		let dashboard = 'userId-1111';
		let userCategoryId = given
			.dashboard(dashboard)
			.category('User Category 1');
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: 'anotheruser@mail.com',
			},
			dashboard: dashboard,
			category: userCategoryId,
		};
		await expect(
			new DeleteCategory(repositoryFactory).execute(input)
		).rejects.toThrow('Invalid access');
		let categories = await repositoryFactory
			.createCategoryRepository()
			.list(dashboard);
		expect(categories).toHaveLength(1);
	});
});
