import mongoose from 'mongoose';
import EntryRepository from '../../../../../../src/domain/repository/EntryRepository';
import Entry from '../../../../../../src/domain/entity/Entry';
import { v4 as uuidv4 } from 'uuid';
import EntryRepositoryMongoDB from '../../../../../../src/infra/out/repository/mongodb/EntryRepositoryMongoDB';

describe.skip('Repository.MongoDB.EntryRepository', () => {
	let connection: mongoose.Connection;
	let entryRepository: EntryRepository;
	let dashboard = uuidv4();
	let otherDashboard = uuidv4();

	beforeAll(() => {
		connection = mongoose.createConnection(process.env.MONGODB_URL as string);
		entryRepository = new EntryRepositoryMongoDB(connection);
	});

	test('should save a new entry', async () => {
		let entry = new Entry(
			dashboard,
			new Date('2022-10-02'),
			'cost',
			'My cost',
			'Fun',
			'Credit Card',
			212.23
		);
		await entryRepository.save(entry);

		let entrySaved = await entryRepository.get(entry.id, dashboard);
		expect(entrySaved?.id).toBe(entry.id);
		expect(entrySaved?.date).toStrictEqual(entry.date);
		expect(entrySaved?.type).toBe(entry.type);
		expect(entrySaved?.description).toBe(entry.description);
		expect(entrySaved?.category).toBe(entry.category);
		expect(entrySaved?.paymentType).toBe(entry.paymentType);
		expect(entrySaved?.amount).toBe(entry.amount);
	});

	test('should update an entry', async () => {
		let entry = new Entry(
			dashboard,
			new Date('2022-09-02'),
			'income',
			'My other cost',
			'Home',
			'Online',
			543.07
		);
		await entryRepository.save(entry);
		let updateData = {
			date: new Date('2022-09-05'),
			type: 'cost' as 'cost',
			description: 'My other cost 02',
			category: 'Study',
			paymentType: 'PIX',
			amount: 514.07,
		};
		entry.update(updateData);
		await entryRepository.save(entry);
		let entrySaved = await entryRepository.get(entry.id, dashboard);
		expect(entrySaved?.id).toBe(entry.id);
		expect(entrySaved?.date).toStrictEqual(entry.date);
		expect(entrySaved?.type).toBe(entry.type);
		expect(entrySaved?.description).toBe(entry.description);
		expect(entrySaved?.category).toBe(entry.category);
		expect(entrySaved?.paymentType).toBe(entry.paymentType);
		expect(entrySaved?.amount).toBe(entry.amount);
	});

	test('should list entries from dashboard', async () => {
		await entryRepository.save(
			new Entry(
				dashboard,
				new Date('2022-11-02'),
				'income',
				'Salary',
				'Salary',
				'Transfer',
				2420.78
			)
		);
		await entryRepository.save(
			new Entry(
				otherDashboard,
				new Date('2022-11-02'),
				'income',
				'Salary',
				'Salary',
				'Transfer',
				2420.78
			)
		);

		let entries = await entryRepository.list(dashboard);
		expect(entries).toHaveLength(3);

		entries = await entryRepository.list(dashboard, 2022, 11);
		expect(entries).toHaveLength(1);

		entries = await entryRepository.list(dashboard, 2022, 12);
		expect(entries).toHaveLength(0);

		entries = await entryRepository.list(otherDashboard);
		expect(entries).toHaveLength(1);
	});

	test('should delete an entry', async () => {
		let entry = new Entry(
			dashboard,
			new Date('2022-10-10'),
			'cost',
			'My cost',
			'Car',
			'Credit Card',
			1600
		);
		await entryRepository.save(entry);
		await entryRepository.delete(entry.id);
		let entrySaved = await entryRepository.get(entry.id, dashboard);
		expect(entrySaved).toBeUndefined();
	});

	afterAll(async () => {
		let entries = await entryRepository.list(dashboard);
		for (let entry of entries) {
			await entryRepository.delete(entry.id);
		}
		entries = await entryRepository.list(otherDashboard);
		for (let entry of entries) {
			await entryRepository.delete(entry.id);
		}

		await connection.destroy(true);
	});
});
