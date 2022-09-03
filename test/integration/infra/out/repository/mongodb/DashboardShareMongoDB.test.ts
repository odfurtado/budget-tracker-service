import mongoose from 'mongoose';
import DashboardShare from '../../../../../../src/domain/entity/DashboardShare';
import DashboardShareRepository from '../../../../../../src/domain/repository/DashboardShareRepository';
import DashboardShareRepositoryMongoDB from '../../../../../../src/infra/out/repository/mongodb/DashboardShareRepositoryMongoDB';

describe.skip('Repository.MongoDB.DashboardShareRepository', () => {
	let connection: mongoose.Connection;
	let dashboardShareRepository: DashboardShareRepository;

	beforeAll(() => {
		connection = mongoose.createConnection(process.env.MONGODB_URL as string);
		dashboardShareRepository = new DashboardShareRepositoryMongoDB(
			connection
		);
	});

	test('Should save a new dashboard share', async () => {
		let dashboardId = 'userId-1111';
		let email = 'anotheruser@mail.com';
		let dashboardShare = new DashboardShare(dashboardId, email);
		await expect(
			dashboardShareRepository.save(dashboardShare)
		).resolves.toBeUndefined();
	});

	test('Should update a new dashboard share', async () => {
		let dashboardId = 'userId-1111';
		let email = 'user2@mail.com';
		let dashboardShare = new DashboardShare(dashboardId, email);
		await dashboardShareRepository.save(dashboardShare);
		//Change data
		dashboardShare.acceptBy(dashboardId, 'userId-user2', email);
		await dashboardShareRepository.save(dashboardShare);
		let dashboardShareSaved = (await dashboardShareRepository.get(
			dashboardShare.id
		)) as DashboardShare;
		expect(dashboardShareSaved).not.toBeNull();
		expect(dashboardShareSaved).toStrictEqual(dashboardShare);
	});

	afterAll(async () => {
		let dashboardShares = await dashboardShareRepository.list();
		for (let dashboardShare of dashboardShares) {
			await dashboardShareRepository.delete(dashboardShare.id);
		}
		await connection.destroy(true);
	});
});
