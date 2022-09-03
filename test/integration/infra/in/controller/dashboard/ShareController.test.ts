import RepositoryFactory from '../../../../../../src/domain/repository/RepositoryFactory';
import ShareController from '../../../../../../src/infra/in/controller/dashboard/ShareController';
import MemoryRepositoryFactory from '../../../../../../src/infra/out/repository/memory/MemoryRepositoryFactory';
import DataGenerator from '../../../../../dataGenerator/DataGenerator';

describe('Controller.Dashboard.ShareController', () => {
	let repositoryFactory: RepositoryFactory;
	let given: DataGenerator;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
		given = new DataGenerator(repositoryFactory);
	});

	test('Should list all dashboard share of a user', async () => {
		let dashboard = given.dashboard('userId-1111');
		dashboard.pendingShareWith('anotherUser02@mail.com');
		dashboard.approvedShareWith('anotherUser03@mail.com', 'userId-3333');
		dashboard.rejectedShareWith('anotherUser04@mail.com');
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let responseData = await new ShareController(repositoryFactory).list(
			userData,
			{ dashboard: userData.id }
		);
		expect(responseData).not.toBeNull();
		expect(responseData).toHaveLength(3);
	});

	test('Cannot list all dashboard share of a other user', async () => {
		let dashboard = given.dashboard('userId-1111');
		dashboard.pendingShareWith('anotherUser02@mail.com');
		dashboard.approvedShareWith('anotherUser03@mail.com', 'userId-3333');
		dashboard.rejectedShareWith('anotherUser04@mail.com');
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		await expect(
			new ShareController(repositoryFactory).list(userData, {
				dashboard,
			})
		).rejects.toThrow('Invalid access');
	});

	test('Should create a dashboard share', async () => {
		let params = {
			dashboard: 'userId-1111',
		};
		let body = {
			email: 'anotheruser@mail.com',
		};
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let result = await new ShareController(repositoryFactory).save(
			userData,
			params,
			body
		);
		expect(result).not.toBeNull();
		expect(result.output).not.toBeNull();
		expect(result.status).toBe(201);
	});

	test('Should accept a dashboard share', async () => {
		let dashboardShareId = given
			.dashboard('userId-1111')
			.pendingShareWith('user02@mail.com');
		let params = {
			dashboard: 'userId-1111',
			id: dashboardShareId,
		};
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		await new ShareController(repositoryFactory).accept(userData, params);
		let dashboardsShare = await repositoryFactory
			.createDashboardShareRepository()
			.getByDashboard(params.dashboard);
		expect(dashboardsShare).toHaveLength(1);
		expect(dashboardsShare[0].dashboard).toBe(params.dashboard);
		expect(dashboardsShare[0].sharedWithUserId).toBe(userData.id);
		expect(dashboardsShare[0].sharedWithEmail).toBe(userData.email);
		expect(dashboardsShare[0].status).toBe('Approved');
	});

	test('Should cancel a dashboard share', async () => {
		let dashboardShareId = given
			.dashboard('userId-1111')
			.pendingShareWith('user02@mail.com');
		let params = {
			dashboard: 'userId-1111',
			id: dashboardShareId,
		};
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		await new ShareController(repositoryFactory).cancel(userData, params);
		let dashboardsShare = await repositoryFactory
			.createDashboardShareRepository()
			.getByDashboard(params.dashboard);
		expect(dashboardsShare).toHaveLength(1);
		expect(dashboardsShare[0].dashboard).toBe(params.dashboard);
		expect(dashboardsShare[0].sharedWithEmail).toBe(userData.email);
		expect(dashboardsShare[0].status).toBe('Rejected');
	});
});
