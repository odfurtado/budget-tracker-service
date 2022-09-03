import Category from '../domain/entity/Category';
import UserData from '../domain/entity/UserData';
import CategoryRepository from '../domain/repository/CategoryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';
import AccessManagement from '../domain/service/AccessManagement';

export default class CreateCategory {
	private categoryRepository: CategoryRepository;

	constructor(private readonly repositoryFactory: RepositoryFactory) {
		this.categoryRepository = repositoryFactory.createCategoryRepository();
	}

	async execute(input: Input): Promise<Output> {
		await AccessManagement.checkAccess(
			this.repositoryFactory,
			input.user,
			input.dashboard
		);
		let category = new Category(input.dashboard, input.name);
		await this.categoryRepository.save(category);
		return { id: category.id };
	}
}

type Input = {
	user: UserData;
	dashboard: string;
	name: string;
};

type Output = {
	id: string;
};
