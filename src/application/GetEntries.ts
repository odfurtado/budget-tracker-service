import Entry from '../domain/entity/Entry';
import UserData from '../domain/entity/UserData';
import EntryRepository from '../domain/repository/EntryRepository';
import RepositoryFactory from '../domain/repository/RepositoryFactory';
import AccessManagement from '../domain/service/AccessManagement';

export default class GetEntries {
	private entryRepository: EntryRepository;

	constructor(readonly repositoryFactory: RepositoryFactory) {
		this.entryRepository = repositoryFactory.createEntryRepository();
	}

	async execute(input: Input): Promise<Output> {
		await AccessManagement.checkAccess(
			this.repositoryFactory,
			input.user,
			input.dashboard
		);

		var entries = await this.entryRepository.list(
			input.dashboard,
			input.year,
			input.month
		);
		return {
			entries,
		};
	}
}

type Input = {
	user: UserData;
	dashboard: string;
	year: number;
	month?: number;
};

type Output = {
	entries: Entry[];
};
