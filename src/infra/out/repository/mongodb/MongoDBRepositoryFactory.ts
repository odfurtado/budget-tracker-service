import mongoose from 'mongoose';
import CategoryRepository from '../../../../domain/repository/CategoryRepository';
import DashboardShareRepository from '../../../../domain/repository/DashboardShareRepository';
import EntryRepository from '../../../../domain/repository/EntryRepository';
import PaymentTypeRepository from '../../../../domain/repository/PaymentTypeRepository';
import RepositoryFactory from '../../../../domain/repository/RepositoryFactory';
import CategoryRepositoryMongoDB from './CategoryRepositoryMongoDB';
import DashboardShareRepositoryMongoDB from './DashboardShareRepositoryMongoDB';
import EntryRepositoryMongoDB from './EntryRepositoryMongoDB';
import PaymentTypeRepositoryMongoDB from './PaymentTypeRepositoryMongoDB';

export default class MongoDBRepositoryFactory implements RepositoryFactory {
	private readonly connection: mongoose.Connection;
	private readonly paymentTypeRepository: PaymentTypeRepository;
	private readonly categoryRepository: CategoryRepository;
	private readonly entryRepository: EntryRepository;
	private readonly dashboardShareRepository: DashboardShareRepository;

	constructor() {
		this.connection = mongoose.createConnection(
			process.env.MONGODB_URL as string
		);
		this.paymentTypeRepository = new PaymentTypeRepositoryMongoDB(
			this.connection
		);
		this.categoryRepository = new CategoryRepositoryMongoDB(this.connection);
		this.entryRepository = new EntryRepositoryMongoDB(this.connection);
		this.dashboardShareRepository = new DashboardShareRepositoryMongoDB(
			this.connection
		);
	}

	createEntryRepository(): EntryRepository {
		return this.entryRepository;
	}

	createCategoryRepository(): CategoryRepository {
		return this.categoryRepository;
	}

	createPaymentTypeRepository(): PaymentTypeRepository {
		return this.paymentTypeRepository;
	}

	createDashboardShareRepository(): DashboardShareRepository {
		return this.dashboardShareRepository;
	}
}
