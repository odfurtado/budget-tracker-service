import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Category from '../../../../../../src/domain/entity/Category';
import CategoryRepository from '../../../../../../src/domain/repository/CategoryRepository';
import CategoryRepositoryMongoDB from '../../../../../../src/infra/out/repository/mongodb/CategoryRepositoryMongoDB';

describe.skip('Repository.MongoDB.CategoryRepository', () => {
	let connection: mongoose.Connection;
	let categoryRepository: CategoryRepository;
	let dashboard = uuidv4();
	let otherDashboard = uuidv4();
	let category: Category;

	beforeAll(() => {
		connection = mongoose.createConnection(process.env.MONGODB_URL as string);
		categoryRepository = new CategoryRepositoryMongoDB(connection);
		category = new Category(dashboard, 'My Category');
	});

	test('should save a new category', async () => {
		await categoryRepository.save(category);
	});

	test('should return category', async () => {
		let categorySaved = await categoryRepository.get(dashboard, category.id);
		expect(category).not.toBeNull();
		expect(category).not.toBeUndefined();
		expect(categorySaved?.id).toBe(category.id);
		expect(categorySaved?.dashboard).toBe(dashboard);
		expect(categorySaved?.name).toBe(category.name);
	});

	test('should list all categories', async () => {
		await categoryRepository.save(new Category(null, 'System Category 01'));
		await categoryRepository.save(new Category(null, 'System Category 02'));
		await categoryRepository.save(new Category(dashboard, 'Other Category'));
		await categoryRepository.save(
			new Category(otherDashboard, 'Category for other user')
		);

		let categories = await categoryRepository.list(dashboard);
		expect(categories).toHaveLength(4);

		categories = await categoryRepository.list(otherDashboard);
		expect(categories).toHaveLength(3);
	});

	test('should delete a category', async () => {
		await categoryRepository.delete(category.id);

		let categorySaved = await categoryRepository.get(dashboard, category.id);
		expect(categorySaved).toBeUndefined();
	});

	afterAll(async () => {
		let categories = await categoryRepository.list(dashboard);
		for (category of categories) {
			await categoryRepository.delete(category.id);
		}
		categories = await categoryRepository.list(otherDashboard);
		for (category of categories) {
			await categoryRepository.delete(category.id);
		}
		await connection.destroy(true);
	});
});
