import Entry from '../../../../../../src/domain/entity/Entry';
import RepositoryFactory from '../../../../../../src/domain/repository/RepositoryFactory';
import EntryController from '../../../../../../src/infra/in/controller/dashboard/EntryController';
import MemoryRepositoryFactory from '../../../../../../src/infra/out/repository/memory/MemoryRepositoryFactory';
import DataGenerator from '../../../../../dataGenerator/DataGenerator';

describe('Controller.Dashboard.Entry', () => {
	let repositoryFactory: RepositoryFactory;
	let given: DataGenerator;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
		given = new DataGenerator(repositoryFactory);
	});

	test('Should list entries related to dashboard', async () => {
		given
			.dashboard('userId-1111')
			.entry(
				new Date('2022-08-24'),
				'income',
				'my salary',
				'salary',
				'online',
				5500
			);
		given
			.dashboard('userId-1111')
			.entry(
				new Date('2022-08-25'),
				'cost',
				'aniversary',
				'fun',
				'credit card',
				200
			);
		given
			.dashboard('userId-1111')
			.entry(
				new Date('2022-09-01'),
				'cost',
				'fruits',
				'market',
				'debit card',
				40.5
			);
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let params = {
			dashboard: 'userId-1111',
			year: 2022,
			month: 8,
		};
		let responseData = await new EntryController(repositoryFactory).list(
			userData,
			params
		);
		expect(responseData).toHaveLength(2);
		params = {
			dashboard: 'userId-1111',
			year: 2022,
			month: 9,
		};
		responseData = await new EntryController(repositoryFactory).list(
			userData,
			params
		);
		expect(responseData).toHaveLength(1);
	});

	test('Should save entry related to dashboard', async () => {
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let params = {
			dashboard: 'userId-1111',
		};
		let body = {
			date: '2022-08-22',
			description: 'my cost 01',
			type: 'cost' as 'cost',
			category: 'fun',
			paymentType: 'credit card',
			installments: 2,
			amount: 100,
		};
		let responseData = await new EntryController(repositoryFactory).save(
			userData,
			params,
			body
		);
		expect(responseData.output.ids).toHaveLength(2);
		expect(responseData.output.dashboard).toBe('userId-1111');
		expect(responseData.status).toBe(201);
		let entries = await repositoryFactory
			.createEntryRepository()
			.list(params.dashboard, 2022, 8);
		expect(entries).toHaveLength(1);
		entries = await repositoryFactory
			.createEntryRepository()
			.list(params.dashboard, 2022, 9);
		expect(entries).toHaveLength(1);
	});

	test('Should update entry related to dashboard', async () => {
		let entryId = given
			.dashboard('userId-1111')
			.entry(
				new Date('2022-08-25'),
				'cost',
				'aniversary',
				'fun',
				'credit card',
				200
			);
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let params = {
			dashboard: 'userId-1111',
			id: entryId,
		};
		let body = {
			date: '2022-09-22',
			description: 'my other cost 01',
			type: 'cost' as 'cost',
			category: 'other',
			paymentType: 'debit card',
			amount: 110,
		};
		await expect(
			new EntryController(repositoryFactory).update(userData, params, body)
		).resolves.toBeUndefined();
		let entry = (await repositoryFactory
			.createEntryRepository()
			.get(entryId, params.dashboard)) as Entry;
		expect(entry).not.toBeNull();
		expect(entry.id).toBe(entryId);
		expect(entry.date).toStrictEqual(new Date(body.date));
		expect(entry.description).toBe(body.description);
		expect(entry.type).toBe(body.type);
		expect(entry.category).toBe(body.category);
		expect(entry.paymentType).toBe(body.paymentType);
		expect(entry.amount).toBe(body.amount);
	});

	test('Should delete entry related to dashboard', async () => {
		let entryId = given
			.dashboard('userId-1111')
			.entry(
				new Date('2022-08-25'),
				'cost',
				'aniversary',
				'fun',
				'credit card',
				200
			);
		let userData = {
			id: 'userId-1111',
			name: 'User 01',
			email: 'user01@mail.com',
		};
		let params = {
			dashboard: 'userId-1111',
			id: entryId,
		};
		await expect(
			new EntryController(repositoryFactory).delete(userData, params)
		).resolves.toBeUndefined();
		let entry = (await repositoryFactory
			.createEntryRepository()
			.get(entryId, params.dashboard)) as Entry;
		expect(entry).toBeUndefined();
	});
});
