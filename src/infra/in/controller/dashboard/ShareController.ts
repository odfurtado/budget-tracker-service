import AcceptDashboardShare from '../../../../application/AcceptDashboardShare';
import CancelDashboardShare from '../../../../application/CancelDashboardShare';
import CreateDashboardShare from '../../../../application/CreateDashboardShare';
import DashboardShare from '../../../../domain/entity/DashboardShare';
import UserData from '../../../../domain/entity/UserData';
import InvalidAccess from '../../../../domain/exception/InvalidAccess';
import RepositoryFactory from '../../../../domain/repository/RepositoryFactory';
import Http from '../../http/Http';

export default class ShareController {
	private readonly dashboardShareRepository;

	constructor(private readonly repositoryFactory: RepositoryFactory) {
		this.dashboardShareRepository =
			this.repositoryFactory.createDashboardShareRepository();
	}

	list = async (userData: UserData, req: any) => {
		let dashboard = req['dashboard'];
		if (dashboard !== userData.id) {
			throw new InvalidAccess();
		}
		let dashboardShared = await this.dashboardShareRepository.getByDashboard(
			dashboard
		);
		return dashboardShared.map(this.mapEntityToShareData);
	};

	save = async (userData: UserData, params: any, body: any) => {
		let input = {
			user: userData,
			dashboard: params['dashboard'],
			shareWith: body.email,
		};
		let output = await new CreateDashboardShare(
			this.repositoryFactory
		).execute(input);
		return {
			output,
			status: 201,
		};
	};

	accept = async (userData: UserData, params: any) => {
		let input = {
			user: userData,
			dashboard: params['dashboard'],
			dashboardShare: params['id'],
		};
		await new AcceptDashboardShare(this.repositoryFactory).execute(input);
	};

	cancel = async (userData: UserData, params: any) => {
		let input = {
			user: userData,
			dashboard: params['dashboard'],
			dashboardShare: params['id'],
		};
		await new CancelDashboardShare(this.repositoryFactory).execute(input);
	};

	private mapEntityToShareData(dashboardShare: DashboardShare): ShareData {
		return {
			id: dashboardShare.id,
			dashboard: dashboardShare.dashboard,
			sharedWith: {
				id: dashboardShare.sharedWithUserId as string,
				email: dashboardShare.sharedWithEmail as string,
			},
			status: dashboardShare.status as string,
			createdAt: dashboardShare.createdAt,
			approvedAt: dashboardShare.approvedAt,
		};
	}

	bind(http: Http) {
		http.on('get', '/dashboard/{dashboard}/share', this.list);
		http.on('post', '/dashboard/{dashboard}/share', this.save);
		http.on('put', '/dashboard/{dashboard}/share/{id}', this.accept);
		http.on('delete', '/dashboard/{dashboard}/share/{id}', this.cancel);
	}
}

type ShareData = {
	id: string;
	dashboard: string;
	sharedWith: {
		id: string;
		email: string;
	};
	status: string;
	createdAt: Date;
	approvedAt: Date | null;
};
