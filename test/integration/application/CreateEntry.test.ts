import CreateEntry from '../../../src/application/CreateEntry';
import RepositoryFactory from '../../../src/domain/repository/RepositoryFactory';
import MemoryRepositoryFactory from '../../../src/infra/out/repository/memory/MemoryRepositoryFactory';
import DataGenerator from '../../dataGenerator/DataGenerator';

describe('UseCase.CreateEntry', () => {
	let repositoryFactory: RepositoryFactory;
	let given: DataGenerator;

	beforeEach(async function () {
		repositoryFactory = new MemoryRepositoryFactory();
		given = new DataGenerator(repositoryFactory);
	});

	test('Should create an entry with 3 installments', async () => {
		let input = {
			user: {
				id: 'idUser-1111',
				name: '',
				email: '',
			},
			dashboard: 'idUser-1111',
			date: new Date('2022-11-02'),
			type: 'cost' as 'cost',
			description: 'ice cream',
			category: 'fun',
			paymentType: 'credit',
			amount: 87.36,
			installments: 3,
		};
		let output = await new CreateEntry(repositoryFactory).execute(input);
		expect(output.ids).toHaveLength(3);
		let entries = await repositoryFactory
			.createEntryRepository()
			.list(output.dashboard);
		expect(entries).toHaveLength(3);
		expect(entries[0].month).toBe(11);
		expect(entries[0].year).toBe(2022);
		expect(entries[0].type).toBe(input.type);
		expect(entries[0].category).toBe(input.category);
		expect(entries[0].paymentType).toBe(input.paymentType);
		expect(entries[0].amount).toBe(input.amount / input.installments);
		expect(entries[1].month).toBe(12);
		expect(entries[1].year).toBe(2022);
		expect(entries[1].amount).toBe(input.amount / input.installments);
		expect(entries[2].month).toBe(1);
		expect(entries[2].year).toBe(2023);
		expect(entries[2].amount).toBe(input.amount / input.installments);
	});

	test('Should create an entry with 1 installment', async () => {
		let input = {
			user: {
				id: 'idUser-1111',
				name: '',
				email: '',
			},
			dashboard: 'idUser-1111',
			date: new Date('2022-11-02'),
			type: 'cost' as 'cost',
			description: 'ice cream',
			category: 'fun',
			paymentType: 'credit',
			amount: 87.36,
			installments: 1,
		};
		let output = await new CreateEntry(repositoryFactory).execute(input);
		expect(output.ids).toHaveLength(1);
		let entries = await repositoryFactory
			.createEntryRepository()
			.list(output.dashboard);
		expect(entries).toHaveLength(1);
		expect(entries[0].month).toBe(11);
		expect(entries[0].year).toBe(2022);
		expect(entries[0].type).toBe(input.type);
		expect(entries[0].category).toBe(input.category);
		expect(entries[0].paymentType).toBe(input.paymentType);
		expect(entries[0].amount).toBe(input.amount);
	});

	test('Should create an entry to dashboard shared with other user', async () => {
		let input = {
			user: {
				id: 'idUser-2222',
				name: '',
				email: '',
			},
			dashboard: 'idUser-1111',
			date: new Date('2022-11-02'),
			type: 'cost' as 'cost',
			description: 'ice cream',
			category: 'fun',
			paymentType: 'credit',
			amount: 87.36,
			installments: 1,
		};
		given
			.dashboard(input.dashboard)
			.approvedShareWith(input.user.email, input.user.id);
		let output = await new CreateEntry(repositoryFactory).execute(input);
		expect(output.ids).toHaveLength(1);
		let entries = await repositoryFactory
			.createEntryRepository()
			.list(output.dashboard);
		expect(entries).toHaveLength(1);
		expect(entries[0].month).toBe(11);
		expect(entries[0].year).toBe(2022);
		expect(entries[0].type).toBe(input.type);
		expect(entries[0].category).toBe(input.category);
		expect(entries[0].paymentType).toBe(input.paymentType);
		expect(entries[0].amount).toBe(input.amount);
	});

	test('Cannot create an entry to dashboard that is not shared', async () => {
		let createEntry = new CreateEntry(repositoryFactory);
		let input = {
			user: {
				id: 'idUser-2222',
				name: '',
				email: '',
			},
			dashboard: 'idUser-1111',
			date: new Date('2022-11-02'),
			type: 'cost' as 'cost',
			description: 'ice cream',
			category: 'fun',
			paymentType: 'credit',
			amount: 87.36,
			installments: 1,
		};
		await expect(createEntry.execute(input)).rejects.toThrow(
			'Invalid access'
		);
	});
});
