import Entry from '../domain/entity/Entry';
import UserData from '../domain/entity/UserData';
import EntryRepository from '../domain/repository/EntryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';
import AccessManagement from '../domain/service/AccessManagement';

export default class CreateEntry {
	private entryRepository: EntryRepository;

	constructor(private readonly repositoryFactory: RepositoryFactory) {
		this.entryRepository = repositoryFactory.createEntryRepository();
	}

	async execute(input: Input): Promise<Output> {
		await AccessManagement.checkAccess(
			this.repositoryFactory,
			input.user,
			input.dashboard
		);
		let entries = Entry.createEntries(
			input.dashboard,
			input.date,
			input.type,
			input.description,
			input.category,
			input.paymentType,
			input.amount,
			input.installments
		);
		for (let entry of entries) {
			await this.entryRepository.save(entry);
		}
		return {
			ids: entries.map((entry) => entry.id),
			dashboard: entries[0].dashboard,
		};
	}
}

type Input = {
	user: UserData;
	dashboard: string;
	date: Date;
	type: 'cost' | 'income';
	description: string;
	category: string;
	paymentType: string;
	installments: number;
	amount: number;
};

type Output = {
	ids: string[];
	dashboard: string;
};
