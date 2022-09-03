import CreateDashboardShare from '../../../src/application/CreateDashboardShare';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';

describe('UseCase.CreateDashboardShare', () => {
	let repositoryFactory: RepositoryFactory;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
	});

	test('Should create a new dashboard share', async () => {
		let dashboardShareRepository =
			repositoryFactory.createDashboardShareRepository();
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: '',
			},
			dashboard: 'userId-1111',
			shareWith: 'anotheruser@mail.com',
		};
		await new CreateDashboardShare(repositoryFactory).execute(input);
		let dashboardShareSaved = await dashboardShareRepository.getByDashboard(
			'userId-1111'
		);
		expect(dashboardShareSaved).toHaveLength(1);
		expect(dashboardShareSaved[0].dashboard).toBe(input.dashboard);
		expect(dashboardShareSaved[0].sharedWithEmail).toBe(input.shareWith);
	});

	test('Cannot duplicate a dashboard share with same user', async () => {
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: '',
			},
			dashboard: 'userId-1111',
			shareWith: 'anotheruser@mail.com',
		};
		let dashboardShareId01 = await new CreateDashboardShare(
			repositoryFactory
		).execute(input);
		let dashboardShareId02 = await new CreateDashboardShare(
			repositoryFactory
		).execute(input);
		expect(dashboardShareId01).toBe(dashboardShareId02);
	});

	test('Cannot share a dashboard from other user', async () => {
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: '',
			},
			dashboard: 'userId-1122',
			shareWith: 'anotheruser@mail.com',
		};
		await expect(() =>
			new CreateDashboardShare(repositoryFactory).execute(input)
		).rejects.toThrow('Invalid access');
	});
});
