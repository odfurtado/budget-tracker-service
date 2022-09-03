import CancelDashboardShare from '../../../src/application/CancelDashboardShare';
import DashboardShare from '../../../src/domain/entity/DashboardShare';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

describe('UseCase.CancelDashboardShare', () => {
	test('Should cancel a pending dashboard share', async () => {
		let repositoryFactory = new MemoryRepositoryFactory();
		let dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
		let dashboardShare = new DashboardShare(
			'userId-1111',
			'validuser@mail.com'
		);
		await dashboardShareRepository.save(dashboardShare);
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: dashboardShare.sharedWithEmail,
			},
			dashboard: 'userId-1111',
			dashboardShare: dashboardShare.id,
		};
		await new CancelDashboardShare(repositoryFactory).execute(input);
		let dashboardShareSaved = (await dashboardShareRepository.get(
			dashboardShare.id
		)) as DashboardShare;
		expect(dashboardShareSaved.status).toBe('Rejected');
	});

	test('Should cancel an approved dashboard share', async () => {
		let repositoryFactory = new MemoryRepositoryFactory();
		let dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
		let dashboardShare = new DashboardShare(
			'userId-1111',
			'validuser@mail.com',
			'userId-2222',
			'Approved',
			new Date(),
			new Date()
		);
		await dashboardShareRepository.save(dashboardShare);
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: dashboardShare.sharedWithEmail,
			},
			dashboard: 'userId-1111',
			dashboardShare: dashboardShare.id,
		};
		await new CancelDashboardShare(repositoryFactory).execute(input);
		let dashboardShareSaved = (await dashboardShareRepository.get(
			dashboardShare.id
		)) as DashboardShare;
		expect(dashboardShareSaved.status).toBe('Cancelled');
	});

	test('Cannot cancel a dashboard share from other user', async () => {
		let repositoryFactory = new MemoryRepositoryFactory();
		let dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
		let dashboardShare = new DashboardShare(
			'userId-1111',
			'validuser@mail.com'
		);
		await dashboardShareRepository.save(dashboardShare);
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: 'invaliduser@mail.com',
			},
			dashboard: 'userId-1111',
			dashboardShare: dashboardShare.id,
		};
		await expect(
			new CancelDashboardShare(repositoryFactory).execute(input)
		).rejects.toThrow('Invalid access');
	});
});
