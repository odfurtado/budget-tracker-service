import AcceptDashboardShare from '../../../src/application/AcceptDashboardShare';
import DashboardShare from '../../../src/domain/entity/DashboardShare';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

describe('UseCase.AcceptDashboardShare', () => {
	test('Should accept a dashboard share', async () => {
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
				id: 'userId-2222',
				name: '',
				email: 'validuser@mail.com',
			},
			dashboard: dashboardShare.dashboard,
			dashboardShare: dashboardShare.id,
		};
		await new AcceptDashboardShare(repositoryFactory).execute(input);
		let dashboardShareSaved = (await dashboardShareRepository.get(
			dashboardShare.id
		)) as DashboardShare;
		expect(dashboardShareSaved.sharedWithUserId).toBe(input.user.id);
		expect(dashboardShareSaved.status).toBe('Approved');
		expect(dashboardShareSaved.approvedAt).not.toBeNull();
	});

	test('Cannot accept a rejected dashboard share', async () => {
		let repositoryFactory = new MemoryRepositoryFactory();
		let dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
		let dashboardShare = new DashboardShare(
			'userId-1111',
			'validuser@mail.com',
			'userId-2222',
			'Rejected'
		);
		await dashboardShareRepository.save(dashboardShare);
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: 'validuser@mail.com',
			},
			dashboard: dashboardShare.dashboard,
			dashboardShare: dashboardShare.id,
		};
		await expect(
			new AcceptDashboardShare(repositoryFactory).execute(input)
		).rejects.toThrow(
			'Cannot accept a dashboard share with status != PendingApproval'
		);
	});

	test('Cannot accept a cancelled dashboard share', async () => {
		let repositoryFactory = new MemoryRepositoryFactory();
		let dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
		let dashboardShare = new DashboardShare(
			'userId-1111',
			'validuser@mail.com',
			undefined,
			'Cancelled'
		);
		await dashboardShareRepository.save(dashboardShare);
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: 'validuser@mail.com',
			},
			dashboard: dashboardShare.dashboard,
			dashboardShare: dashboardShare.id,
		};
		await expect(
			new AcceptDashboardShare(repositoryFactory).execute(input)
		).rejects.toThrow(
			'Cannot accept a dashboard share with status != PendingApproval'
		);
	});

	test('Cannot accept an approved dashboard share', async () => {
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
				id: 'userId-2222',
				name: '',
				email: 'validuser@mail.com',
			},
			dashboard: dashboardShare.dashboard,
			dashboardShare: dashboardShare.id,
		};
		await expect(
			new AcceptDashboardShare(repositoryFactory).execute(input)
		).rejects.toThrow(
			'Cannot accept a dashboard share with status != PendingApproval'
		);
	});

	test('Cannot accept dashboard share from other user', async () => {
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
				id: 'userId-2222',
				name: '',
				email: 'invaliduser@mail.com',
			},
			dashboard: dashboardShare.dashboard,
			dashboardShare: dashboardShare.id,
		};
		await expect(
			new AcceptDashboardShare(repositoryFactory).execute(input)
		).rejects.toThrow('Invalid access');
	});
});
