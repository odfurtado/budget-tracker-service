import UserData from '../domain/entity/UserData';
import EntityNotFound from '../domain/exception/EntityNotFound';
import CategoryRepository from '../domain/repository/CategoryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';
import AccessManagement from '../domain/service/AccessManagement';

export default class DeleteCategory {
	private categoryRepository: CategoryRepository;

	constructor(private readonly repositoryFactory: RepositoryFactory) {
		this.categoryRepository = repositoryFactory.createCategoryRepository();
	}

	async execute(input: Input): Promise<void> {
		await AccessManagement.checkAccess(
			this.repositoryFactory,
			input.user,
			input.dashboard
		);
		let category = await this.categoryRepository.get(
			input.dashboard,
			input.category
		);
		if (!category) {
			throw new EntityNotFound('Category');
		}
		this.categoryRepository.delete(category.id);
	}
}

type Input = {
	user: UserData;
	dashboard: string;
	category: string;
};
