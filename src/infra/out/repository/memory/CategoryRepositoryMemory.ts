import Category from '../../../../domain/entity/Category';
import CategoryRepository from '../../../../domain/repository/CategoryRepository';

export default class CategoryRepositoryMemory implements CategoryRepository {
	categories: Category[] = [];

	async list(dashboard?: string | undefined): Promise<Category[]> {
		return this.categories.filter(
			(category) =>
				category.dashboard === null ||
				!dashboard ||
				category.dashboard === dashboard
		);
	}

	async get(dashboard: string, id: string): Promise<Category | undefined> {
		return this.categories.find(
			(category) => category.dashboard === dashboard && category.id === id
		);
	}

	async save(category: Category): Promise<void> {
		if (!category || !category.name) {
			throw new Error('category.name required');
		}
		this.categories.push(category);
	}

	async delete(id: string): Promise<void> {
		this.categories = this.categories.filter(
			(category) => category.id !== id
		);
	}
}
