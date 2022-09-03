import GetUserInformation from '../../../src/application/GetUserInformation';
import DashboardShare from '../../../src/domain/entity/DashboardShare';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

describe('UseCase.GetUserInformation', () => {
	let repositoryFactory: RepositoryFactory;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
	});

	test('Should pack user informations', async () => {
		let input = {
			user: {
				id: 'userId-1111',
				name: 'User 01',
				email: 'user01@mail.com',
			},
		};
		let dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
		dashboardShareRepository.save(
			new DashboardShare(
				'userId-2222',
				input.user.email,
				input.user.id,
				'Approved'
			)
		);
		dashboardShareRepository.save(
			new DashboardShare(
				'userId-3333',
				input.user.email,
				input.user.id,
				'Approved'
			)
		);
		dashboardShareRepository.save(
			new DashboardShare(
				'userId-4444',
				input.user.email,
				input.user.id,
				'Cancelled'
			)
		);
		dashboardShareRepository.save(
			new DashboardShare('userId-4444', input.user.email)
		);
		let output = await new GetUserInformation(repositoryFactory).execute(
			input
		);
		expect(output.dashboards).not.toBeNull();
		expect(output.dashboards).toHaveLength(3);
		expect(output.dashboards).toContain('userId-1111');
		expect(output.dashboards).toContain('userId-2222');
		expect(output.dashboards).toContain('userId-3333');
	});
});
