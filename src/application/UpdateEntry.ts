import UserData from '../domain/entity/UserData';
import EntityNotFound from '../domain/exception/EntityNotFound';
import EntryRepository from '../domain/repository/EntryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';
import AccessManagement from '../domain/service/AccessManagement';

export default class UpdateEntry {
	private entryRepository: EntryRepository;

	constructor(readonly repositoryFactory: RepositoryFactory) {
		this.entryRepository = repositoryFactory.createEntryRepository();
	}

	async execute(input: Input): Promise<void> {
		await AccessManagement.checkAccess(
			this.repositoryFactory,
			input.user,
			input.dashboard
		);
		var entry = await this.entryRepository.get(input.id, input.dashboard);
		if (!entry) {
			throw new EntityNotFound('Entry');
		}
		entry.update({
			date: input.date,
			type: input.type,
			description: input.description,
			category: input.category,
			paymentType: input.paymentType,
			amount: input.amount,
		});
		await this.entryRepository.save(entry);
	}
}

type Input = {
	user: UserData;
	dashboard: string;
	id: string;
	date?: Date;
	type?: 'cost' | 'income';
	description?: string;
	category?: string;
	paymentType?: string;
	amount?: number;
};
