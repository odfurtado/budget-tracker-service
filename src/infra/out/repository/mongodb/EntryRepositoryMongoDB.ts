import mongoose from 'mongoose';
import Entry from '../../../../domain/entity/Entry';
import EntryRepository from '../../../../domain/repository/EntryRepository';
import EntrySchema from './model/EntryModel';

export default class EntryRepositoryMongoDB implements EntryRepository {
	private EntryModel;
	constructor(connection: mongoose.Connection) {
		this.EntryModel = connection.model<Entry>('Entry', EntrySchema);
	}

	async save(entry: Entry): Promise<void> {
		let entryModel = await this.EntryModel.findOne({ id: entry.id });

		if (!entryModel) {
			entryModel = new this.EntryModel({
				id: entry.id,
				dashboard: entry.dashboard,
				date: entry.date,
				type: entry.type,
				description: entry.description,
				category: entry.category,
				paymentType: entry.paymentType,
				amount: entry.amount,
				month: entry.month,
				year: entry.year,
			});
			await entryModel.save();
		} else {
			await entryModel.update({
				date: entry.date,
				type: entry.type,
				description: entry.description,
				category: entry.category,
				paymentType: entry.paymentType,
				amount: entry.amount,
				month: entry.month,
				year: entry.year,
			});
		}
	}

	async get(id: string, dashboard: string): Promise<Entry | undefined> {
		let entryModel = await this.EntryModel.findOne({ id, dashboard });
		if (!entryModel) {
			return undefined;
		}
		return this.mapModelToEntity(entryModel);
	}

	async list(
		dashboard: string,
		year?: number | undefined,
		month?: number | undefined
	): Promise<Entry[]> {
		let query = { dashboard } as any;
		if (year && month) {
			query = { ...query, year, month };
		}
		let entries = await this.EntryModel.find(query);
		return entries.map(this.mapModelToEntity);
	}

	async delete(id: string): Promise<void> {
		await this.EntryModel.findOneAndDelete({ id });
	}

	private mapModelToEntity(model: Model) {
		return new Entry(
			model.id,
			model.date,
			model.type,
			model.description,
			model.category,
			model.paymentType,
			model.amount,
			model.id
		);
	}
}

type Model = mongoose.Document<unknown, any, Entry> &
	Entry & {
		_id: mongoose.Types.ObjectId;
	};
