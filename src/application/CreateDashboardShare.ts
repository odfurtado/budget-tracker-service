import DashboardShare from '../domain/entity/DashboardShare';
import UserData from '../domain/entity/UserData';
import DashboardShareRepository from '../domain/repository/DashboardShareRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';

export default class CreateDashboardShare {
	private readonly dashboardShareRepository: DashboardShareRepository;

	constructor(repositoryFactory: RepositoryFactory) {
		this.dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
	}

	async execute(input: Input): Promise<string> {
		DashboardShare.canBeShared(input.user, input.dashboard);
		let pendingOrApprovedDashboardShareWithUser =
			await this.getPendingOrApprovedDashboardShare(
				input.dashboard,
				input.shareWith
			);
		if (pendingOrApprovedDashboardShareWithUser.length !== 0) {
			return pendingOrApprovedDashboardShareWithUser[0].id;
		}
		let dashboardShare = new DashboardShare(input.dashboard, input.shareWith);
		await this.dashboardShareRepository.save(dashboardShare);
		return dashboardShare.id;
	}

	private async getPendingOrApprovedDashboardShare(
		dashboard: string,
		shareWith: string
	) {
		let dashboardSharedWithUsers =
			await this.dashboardShareRepository.getByDashboard(dashboard);
		return dashboardSharedWithUsers.filter(
			(dashboardShare) =>
				dashboardShare.sharedWithEmail === shareWith &&
				(dashboardShare.status === 'Approved' ||
					dashboardShare.status === 'PendingApproval')
		);
	}
}

type Input = {
	user: UserData;
	dashboard: string;
	shareWith: string;
};
