import Category from '../domain/entity/Category';
import UserData from '../domain/entity/UserData';
import CategoryRepository from '../domain/repository/CategoryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';
import AccessManagement from '../domain/service/AccessManagement';

export default class GetCategories {
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
		let categories = await this.categoryRepository.list(input.dashboard);
		return {
			categories,
		};
	}
}

type Input = {
	user: UserData;
	dashboard: string;
};

type Output = {
	categories: Category[];
};
