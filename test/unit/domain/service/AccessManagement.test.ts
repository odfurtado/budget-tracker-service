import DashboardShare from '../../../../src/domain/entity/DashboardShare';
import DashboardShareRepository from '../../../../src/domain/repository/DashboardShareRepository';
import RepositoryFactory from '../../../../src/domain/repository/RepositoryFactory';
import AccessManagement from '../../../../src/domain/service/AccessManagement';
import MemoryRepositoryFactory from '../../../../src/infra/out/repository/memory/MemoryRepositoryFactory';
import DataGenerator from '../../../dataGenerator/DataGenerator';

describe('DomainService.AccessMangement', () => {
	let repositoryFactory: RepositoryFactory;
	let given: DataGenerator;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
		given = new DataGenerator(repositoryFactory);
	});

	test('Current user has access', async () => {
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let dashboard = 'userId-1111';
		await AccessManagement.checkAccess(
			repositoryFactory,
			userData,
			dashboard
		);
	});

	test('Current user has not access to another dashboard', async () => {
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		let dashboard = 'userId-1111';
		await expect(
			AccessManagement.checkAccess(repositoryFactory, userData, dashboard)
		).rejects.toThrow('Invalid access');
	});

	test('Current user has access to another dashboard', async () => {
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		let dashboard = 'userId-1111';
		given.dashboard(dashboard).approvedShareWith(userData.email, userData.id);
		await AccessManagement.checkAccess(
			repositoryFactory,
			userData,
			dashboard
		);
	});

	test('Current user has rejected access to another dashboard', async () => {
		let userData = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		let dashboard = 'userId-1111';
		given
			.dashboard(dashboard)
			.cancelledShareWith(userData.email, userData.id);
		await expect(
			AccessManagement.checkAccess(repositoryFactory, userData, dashboard)
		).rejects.toThrow('Invalid access');
	});
});
