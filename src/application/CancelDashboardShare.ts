import UserData from '../domain/entity/UserData';
import EntityNotFound from '../domain/exception/EntityNotFound';
import DashboardShareRepository from '../domain/repository/DashboardShareRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class CancelDashboardShare {
	private readonly dashboardShareRepository: DashboardShareRepository;

	constructor(repositoryFactory: RepositoryFactory) {
		this.dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
	}

	async execute(input: Input): Promise<void> {
		let dashboardShare = await this.dashboardShareRepository.get(
			input.dashboardShare
		);
		if (!dashboardShare) {
			throw new EntityNotFound('Dashboard Share');
		}
		dashboardShare.cancelBy(input.dashboard, input.user);
		await this.dashboardShareRepository.save(dashboardShare);
	}
}

type Input = {
	user: UserData;
	dashboard: string;
	dashboardShare: string;
};
