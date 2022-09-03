import DashboardShare from '../entity/DashboardShare';
import UserData from '../entity/UserData';
import InvalidAccess from '../exception/InvalidAccess';
import RepositoryFactory from '../repository/RepositoryFactory';

export default class AccessManagement {
	public static async checkAccess(
		repositoryFactory: RepositoryFactory,
		user: UserData,
		dashboard: string
	) {
		let dashboardFromCurrentUser = user.id === dashboard;
		if (dashboardFromCurrentUser) {
			return;
		}
		let dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
		let currentDashboardShare = await dashboardShareRepository.getCurrent(
			dashboard,
			user.id
		);
		let dashboarShareIsActive =
			currentDashboardShare &&
			currentDashboardShare.isActive(dashboard, user.id);
		if (dashboarShareIsActive) {
			return;
		}
		throw new InvalidAccess();
	}
}
