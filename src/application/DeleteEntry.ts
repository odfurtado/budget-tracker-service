import UserData from '../domain/entity/UserData';
import EntityNotFound from '../domain/exception/EntityNotFound';
import EntryRepository from '../domain/repository/EntryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';
import AccessManagement from '../domain/service/AccessManagement';

export default class DeleteEntry {
	private readonly entryRepository: EntryRepository;

	constructor(private readonly repositoryFactory: RepositoryFactory) {
		this.entryRepository = repositoryFactory.createEntryRepository();
	}

	async execute(input: Input): Promise<void> {
		await AccessManagement.checkAccess(
			this.repositoryFactory,
			input.user,
			input.dashboard
		);
		let entry = await this.entryRepository.get(input.entry, input.dashboard);
		if (!entry) {
			throw new EntityNotFound('Entry');
		}
		await this.entryRepository.delete(entry.id as string);
	}
}

type Input = {
	user: UserData;
	dashboard: string;
	entry: string;
};
