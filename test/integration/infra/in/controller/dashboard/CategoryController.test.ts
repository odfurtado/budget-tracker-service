import DeleteCategory from '../../../../../../src/application/DeleteCategory';
import RepositoryFactory from '../../../../../../src/domain/repository/RepositoryFactory';
import CategoryController from '../../../../../../src/infra/in/controller/dashboard/CategoryController';
import MemoryRepositoryFactory from '../../../../../../src/infra/out/repository/memory/MemoryRepositoryFactory';
import DataGenerator from '../../../../../dataGenerator/DataGenerator';

describe('Controller.Dashboard.Category', () => {
	let repositoryFactory: RepositoryFactory;
	let given: DataGenerator;
	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
		given = new DataGenerator(repositoryFactory);
	});

	test('Should list categories related to dashboard', async () => {
		given.systemCategory('system category 01');
		given.systemCategory('system category 02');
		given.dashboard('userId-1111').category('category 01');
		given.dashboard('userId-2222').category('category 02');
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let params = {
			dashboard: 'userId-1111',
		};
		let categories = await new CategoryController(repositoryFactory).list(
			userData,
			params
		);
		expect(categories).toHaveLength(3);
	});

	test('Should save category related to dashboard', async () => {
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let params = {
			dashboard: 'userId-1111',
		};
		let body = {
			name: 'Category',
		};
		let responseData = await new CategoryController(repositoryFactory).save(
			userData,
			params,
			body
		);
		expect(responseData.output).not.toBeNull();
		expect(responseData.status).toBe(201);
		let category = await repositoryFactory
			.createCategoryRepository()
			.get('userId-1111', responseData.output);
		expect(category).not.toBeNull();
		expect(category).not.toBeUndefined();
		expect(category?.id).toBe(responseData.output);
		expect(category?.name).toBe(body.name);
	});

	test('Should delete category related to dashboard', async () => {
		given.systemCategory('system category 01');
		let categoryId = given
			.dashboard('userId-1111')
			.category('my category 01');
		given.dashboard('userId-1111').category('my category 02');
		let categoryRepository = repositoryFactory.createCategoryRepository();
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let params = {
			dashboard: 'userId-1111',
			id: categoryId,
		};
		await expect(
			new CategoryController(repositoryFactory).delete(userData, params)
		).resolves.toBeUndefined();
		let category = await categoryRepository.get('userId-1111', categoryId);
		expect(category).toBeUndefined();
	});
});
