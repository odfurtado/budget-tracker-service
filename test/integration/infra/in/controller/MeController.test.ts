import DashboardShare from '../../../../../src/domain/entity/DashboardShare';
import RepositoryFactory from '../../../../../src/domain/repository/RepositoryFactory';
import MeController from '../../../../../src/infra/in/controller/MeController';
import MemoryRepositoryFactory from '../../../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

describe('Controller.Me', () => {
	let repositoryFactory: RepositoryFactory;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
	});

	test('Should return current user information', async () => {
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
		dashboardShareRepository.save(
			new DashboardShare(
				'userId-2222',
				userData.email,
				userData.id,
				'Approved'
			)
		);
		dashboardShareRepository.save(
			new DashboardShare(
				'userId-3333',
				userData.email,
				userData.id,
				'Approved'
			)
		);
		dashboardShareRepository.save(
			new DashboardShare(
				'userId-4444',
				userData.email,
				userData.id,
				'Cancelled'
			)
		);
		dashboardShareRepository.save(
			new DashboardShare(
				'userId-5555',
				'otheruser@mail.com',
				'userId-2222',
				'Approved'
			)
		);
		let userInformation = await new MeController(
			repositoryFactory
		).getUserInformation(userData);
		expect(userInformation).not.toBeNull();
		expect(userInformation.id).toBe(userData.id);
		expect(userInformation.name).toBe(userData.name);
		expect(userInformation.email).toBe(userData.email);
		expect(userInformation.dashboards).toHaveLength(3);
		expect(userInformation.dashboards).toContain('userId-1111');
		expect(userInformation.dashboards).toContain('userId-2222');
		expect(userInformation.dashboards).toContain('userId-3333');
	});
});
