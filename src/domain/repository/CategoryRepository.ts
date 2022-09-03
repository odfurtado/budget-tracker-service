import Category from '../entity/Category';

export default interface CategoryRepository {
	list(dashboard?: string): Promise<Category[]>;
	get(dashboard: string, id: string): Promise<Category | undefined>;
	save(category: Category): Promise<void>;
	delete(id: string): Promise<void>;
}
