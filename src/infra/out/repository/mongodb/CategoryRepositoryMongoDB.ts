import mongoose from 'mongoose';
import Category from '../../../../domain/entity/Category';
import CategoryRepository from '../../../../domain/repository/CategoryRepository';
import CategorySchema from './model/CategoryModel';

export default class CategoryRepositoryMongoDB implements CategoryRepository {
	private readonly CategoryModel;
	constructor(private readonly connection: mongoose.Connection) {
		this.CategoryModel = this.connection.model<Category>(
			'Category',
			CategorySchema
		);
	}

	async list(dashboard?: string | undefined): Promise<Category[]> {
		let categories = await this.CategoryModel.find({
			$or: [{ dashboard: null }, { dashboard }],
		}).exec();

		return categories.map(
			(category) =>
				new Category(category.dashboard, category.name, category.id)
		);
	}

	async get(dashboard: string, id: string): Promise<Category | undefined> {
		let category = await this.CategoryModel.findOne({ dashboard, id }).exec();

		if (!category) {
			return undefined;
		}

		return new Category(category.dashboard, category.name, category.id);
	}

	async save(category: Category): Promise<void> {
		let categoryModel = new this.CategoryModel(category);
		await categoryModel.save();
	}

	async delete(id: string): Promise<void> {
		await this.CategoryModel.deleteOne({ id }).exec();
	}
}
