import UpdateEntry from '../../../src/application/UpdateEntry';
import Entry from '../../../src/domain/entity/Entry';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';
import DataGenerator from '../../dataGenerator/DataGenerator';

describe('UseCase.UpdateEntry', () => {
	let repositoryFactory: RepositoryFactory;
	let given: DataGenerator;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
		given = new DataGenerator(repositoryFactory);
	});

	test('Should update an entry from dashboard', async () => {
		let entryId = given
			.dashboard('userId-1111')
			.entry(
				new Date('2022-11-01'),
				'income',
				'salary',
				'salary',
				'transfer',
				7000
			);
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: '',
			},
			dashboard: 'userId-1111',
			id: entryId,
			date: new Date('2023-12-01'),
			type: 'cost' as 'cost',
			description: 'theather',
			category: 'fun',
			paymentType: 'credit_card',
			amount: 1000,
		};
		await new UpdateEntry(repositoryFactory).execute(input);
		let entrySaved = (await repositoryFactory
			.createEntryRepository()
			.get(entryId, input.dashboard)) as Entry;
		expect(entrySaved).not.toBeNull();
		expect(entrySaved.month).toBe(input.date.getUTCMonth() + 1);
		expect(entrySaved.year).toBe(input.date.getUTCFullYear());
		expect(entrySaved.type).toBe(input.type);
		expect(entrySaved.description).toBe(input.description);
		expect(entrySaved.category).toBe(input.category);
		expect(entrySaved.paymentType).toBe(input.paymentType);
		expect(entrySaved.amount).toBe(input.amount);
	});

	test('Should update an entry from dashboard shared', async () => {
		let entryId = given
			.dashboard('userId-1111')
			.entry(
				new Date('2022-11-01'),
				'income',
				'salary',
				'salary',
				'transfer',
				7000
			);
		given
			.dashboard('userId-1111')
			.approvedShareWith('user02@mail.com', 'userId-2222');
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: '',
			},
			dashboard: 'userId-1111',
			id: entryId,
			date: new Date('2023-12-01'),
			type: 'cost' as 'cost',
			description: 'theather',
			category: 'fun',
			paymentType: 'credit_card',
			amount: 1000,
		};
		await new UpdateEntry(repositoryFactory).execute(input);
		let entrySaved = (await repositoryFactory
			.createEntryRepository()
			.get(entryId, input.dashboard)) as Entry;
		expect(entrySaved).not.toBeNull();
		expect(entrySaved.month).toBe(input.date.getUTCMonth() + 1);
		expect(entrySaved.year).toBe(input.date.getUTCFullYear());
		expect(entrySaved.type).toBe(input.type);
		expect(entrySaved.description).toBe(input.description);
		expect(entrySaved.category).toBe(input.category);
		expect(entrySaved.paymentType).toBe(input.paymentType);
		expect(entrySaved.amount).toBe(input.amount);
	});

	test('Cannot update an entry from dashboard that is not shared', async () => {
		let entryId = given
			.dashboard('userId-1111')
			.entry(
				new Date('2022-11-01'),
				'income',
				'salary',
				'salary',
				'transfer',
				7000
			);
		let input = {
			user: {
				id: 'userId-2222',
				name: '',
				email: '',
			},
			dashboard: 'userId-1111',
			id: entryId,
			date: new Date('2023-12-01'),
			type: 'cost' as 'cost',
			description: 'theather',
			category: 'fun',
			paymentType: 'credit_card',
			amount: 1000,
		};
		await expect(
			new UpdateEntry(repositoryFactory).execute(input)
		).rejects.toThrow('Invalid access');
	});

	test('Cannot update an invalid entry', async () => {
		let input = {
			user: {
				id: 'userId-1111',
				name: '',
				email: '',
			},
			dashboard: 'userId-1111',
			id: 'invalidentryid',
		};
		await expect(
			new UpdateEntry(repositoryFactory).execute(input)
		).rejects.toThrow('Entry not found');
	});
});
