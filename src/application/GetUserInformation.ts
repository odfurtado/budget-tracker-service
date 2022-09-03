import UserData from '../domain/entity/UserData';
import DashboardShareRepository from '../domain/repository/DashboardShareRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class GetUserInformation {
	private readonly dashboardShareRepository: DashboardShareRepository;

	constructor(private readonly repositoryFactory: RepositoryFactory) {
		this.dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
	}

	async execute(input: Input): Promise<Output> {
		let dashboardSharedWithUser =
			await this.dashboardShareRepository.getByUser(input.user.id);
		let dashboardShareApproved = dashboardSharedWithUser.filter(
			(dashboard) => dashboard.status === 'Approved'
		);
		let dashboardsIds = dashboardShareApproved.map(
			(dashboardShare) => dashboardShare.dashboard
		);
		dashboardsIds.push(input.user.id);
		return {
			...input.user,
			dashboards: dashboardsIds,
		};
	}
}

type Input = {
	user: UserData;
};

type Output = UserData & {
	dashboards: string[];
};
