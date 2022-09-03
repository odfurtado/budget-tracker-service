import GetEntries from '../../../src/application/GetEntries';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';
import DataGenerator from '../../dataGenerator/DataGenerator';

describe('UseCase.GetEntries', () => {
	let repositoryFactory: RepositoryFactory;
	let given: DataGenerator;

	beforeEach(() => {
		repositoryFactory = new MemoryRepositoryFactory();
		given = new DataGenerator(repositoryFactory);
	});

	test('Should return the entries from dashboard', async () => {
		given
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
			month: 11,
			year: 2022,
		};
		let output = await new GetEntries(repositoryFactory).execute(input);
		let entries = output.entries;
		expect(entries).toHaveLength(1);
		expect(entries[0].month).toBe(11);
		expect(entries[0].year).toBe(2022);
		expect(entries[0].type).toBe('income');
		expect(entries[0].amount).toBe(7000);
	});

	test('Should return the entries from dashboard shared', async () => {
		given
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
			month: 11,
			year: 2022,
		};
		let output = await new GetEntries(repositoryFactory).execute(input);
		let entries = output.entries;
		expect(entries).toHaveLength(1);
		expect(entries[0].dashboard).toBe(input.dashboard);
		expect(entries[0].month).toBe(11);
		expect(entries[0].year).toBe(2022);
		expect(entries[0].type).toBe('income');
		expect(entries[0].amount).toBe(7000);
	});

	test('Cannot return the entries from dashboard that is not shared', async () => {
		given
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
			month: 11,
			year: 2022,
		};
		await expect(
			new GetEntries(repositoryFactory).execute(input)
		).rejects.toThrow('Invalid access');
	});
});
