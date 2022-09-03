import CategoryRepository from './CategoryRepository';
import DashboardShareRepository from './DashboardShareRepository';
import EntryRepository from './EntryRepository';
import PaymentTypeRepository from './PaymentTypeRepository';

export default interface RepositoryFactory {
	createEntryRepository(): EntryRepository;
	createCategoryRepository(): CategoryRepository;
	createPaymentTypeRepository(): PaymentTypeRepository;
	createDashboardShareRepository(): DashboardShareRepository;
}
