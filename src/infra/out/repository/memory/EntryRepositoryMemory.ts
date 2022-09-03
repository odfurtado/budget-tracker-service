import Entry from '../../../../domain/entity/Entry';
import EntryRepository from '../../../../domain/repository/EntryRepository';

export default class EntryRepositoryMemory implements EntryRepository {
	entries: Entry[] = [];

	async save(entry: Entry): Promise<void> {
		var index = this.entries.findIndex((e) => e.id === entry.id);
		if (index === -1) {
			this.entries.push(entry);
		} else {
			this.entries[index] = entry;
		}
	}

	async get(id: string, dashboard: string): Promise<Entry | undefined> {
		return this.entries.find(
			(entry) => entry.id === id && entry.dashboard === dashboard
		);
	}

	async list(
		dashboard: string,
		year?: number,
		month?: number
	): Promise<Entry[]> {
		return this.entries.filter(
			(entry) =>
				entry.dashboard === dashboard &&
				(!year || entry.year === year) &&
				(!month || entry.month === month)
		);
	}

	async delete(id: string): Promise<void> {
		this.entries = this.entries.filter((entry) => entry.id !== id);
	}
}
