import DashboardShare from '../../../../domain/entity/DashboardShare';
import DashboardShareRepository from '../../../../domain/repository/DashboardShareRepository';

export default class DashboardShareRepositoryMemory
	implements DashboardShareRepository
{
	private dashboardShares: DashboardShare[] = [];

	async save(dashboardShare: DashboardShare): Promise<void> {
		var index = this.dashboardShares.findIndex(
			(e) => e.id === dashboardShare.id
		);
		if (index === -1) {
			this.dashboardShares.push(dashboardShare);
		} else {
			this.dashboardShares[index] = dashboardShare;
		}
	}

	async get(id: string): Promise<DashboardShare | undefined> {
		//throw new Error('AAAAAAA');
		return this.dashboardShares.find(
			(dashboardShare) => dashboardShare.id === id
		);
	}

	async getByUser(userId: string): Promise<DashboardShare[]> {
		return this.dashboardShares.filter(
			(dashboardShare) => dashboardShare.sharedWithUserId === userId
		);
	}

	async getByEmail(userEmail: string): Promise<DashboardShare[]> {
		return this.dashboardShares.filter(
			(dashboardShare) => dashboardShare.sharedWithEmail === userEmail
		);
	}

	async getByDashboard(dashboard: string): Promise<DashboardShare[]> {
		return this.dashboardShares.filter(
			(dashboardShare) => dashboardShare.dashboard === dashboard
		);
	}

	async getCurrent(
		dashboard: string,
		user: string
	): Promise<DashboardShare | undefined> {
		let dashboardShareFound = this.dashboardShares.filter(
			(dashboardShare) =>
				dashboardShare.dashboard === dashboard &&
				dashboardShare.sharedWithUserId === user &&
				dashboardShare.status === 'Approved'
		);
		if (dashboardShareFound && dashboardShareFound.length !== 0) {
			return dashboardShareFound[0];
		}
	}

	//For test only
	async list(): Promise<DashboardShare[]> {
		return this.dashboardShares;
	}

	async delete(id: string): Promise<void> {
		this.dashboardShares = this.dashboardShares.filter(
			(dashboardShare) => dashboardShare.id !== id
		);
	}
}
