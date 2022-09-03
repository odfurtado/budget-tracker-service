import Entry from '../entity/Entry';

export default interface EntryRepository {
	save(entry: Entry): Promise<void>;
	get(id: string, dashboard: string): Promise<Entry | undefined>;
	delete(id: string): Promise<void>;
	list(dashboard: string, year?: number, month?: number): Promise<Entry[]>;
}
