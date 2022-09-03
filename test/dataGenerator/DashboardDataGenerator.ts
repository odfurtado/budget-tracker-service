import Category from '../../src/domain/entity/Category';
import DashboardShare from '../../src/domain/entity/DashboardShare';
import Entry, { EntryType } from '../../src/domain/entity/Entry';
import DashboardShareRepository from '../../src/domain/repository/DashboardShareRepository';
import RepositoryFactory from '../../src/domain/repository/RepositoryFactory';

export default class DashboardDataGenerator {
	private readonly dashboardShareRepository: DashboardShareRepository;

	constructor(
		private readonly dashboard: string,
		private readonly repositoryFactory: RepositoryFactory
	) {
		this.dashboardShareRepository =
			this.repositoryFactory.createDashboardShareRepository();
	}

	pendingShareWith(sharedWithEmail: string) {
		let dashboardShare = new DashboardShare(this.dashboard, sharedWithEmail);
		this.dashboardShareRepository.save(dashboardShare);
		return dashboardShare.id;
	}

	approvedShareWith(sharedWithEmail: string, sharedWithId: string) {
		let dashboardShare = new DashboardShare(
			this.dashboard,
			sharedWithEmail,
			sharedWithId,
			'Approved',
			new Date(),
			new Date()
		);
		this.dashboardShareRepository.save(dashboardShare);
		return dashboardShare.id;
	}

	rejectedShareWith(sharedWithEmail: string) {
		let dashboardShare = new DashboardShare(
			this.dashboard,
			sharedWithEmail,
			undefined,
			'Rejected'
		);
		this.dashboardShareRepository.save(dashboardShare);
		return dashboardShare.id;
	}

	cancelledShareWith(sharedWithEmail: string, sharedWithId: string) {
		let dashboardShare = new DashboardShare(
			this.dashboard,
			sharedWithEmail,
			sharedWithId,
			'Cancelled',
			new Date(),
			new Date()
		);
		this.dashboardShareRepository.save(dashboardShare);
		return dashboardShare.id;
	}

	category(name: string) {
		let category = new Category(this.dashboard, name);
		this.repositoryFactory.createCategoryRepository().save(category);
		return category.id;
	}

	entry(
		date: Date,
		type: EntryType,
		description: string,
		category: string,
		paymentType: string,
		amount: number
	) {
		let entry = new Entry(
			this.dashboard,
			date,
			type,
			description,
			category,
			paymentType,
			amount
		);
		this.repositoryFactory.createEntryRepository().save(entry);
		return entry.id;
	}
}
