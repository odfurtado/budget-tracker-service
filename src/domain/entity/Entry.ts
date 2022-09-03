import addMonths from 'date-fns/addMonths';
import { v4 as uuidv4 } from 'uuid';

export default class Entry {
	readonly id: string;
	private _month: number;
	private _year: number;

	constructor(
		readonly dashboard: string,
		private _date: Date,
		private _type: EntryType,
		private _description: string,
		private _category: string,
		private _paymentType: string,
		private _amount: number,
		id?: string
	) {
		this.id = id ? id : uuidv4();
		this._month = _date.getUTCMonth() + 1;
		this._year = _date.getFullYear();
	}

	static createEntries(
		dashboard: string,
		date: Date,
		type: EntryType,
		description: string,
		category: string,
		paymentType: string,
		amount: number,
		installments: number
	): Entry[] {
		var entries: Entry[] = [];
		var installmentAmount = amount / installments;

		for (
			var currentInstallment = 1;
			currentInstallment <= installments;
			currentInstallment++
		) {
			if (currentInstallment === installments) {
				installmentAmount += amount - installmentAmount * installments;
			}

			var currentInstallmentDate = addMonths(date, currentInstallment - 1);
			var currentInstallmentDescription =
				installments === 1
					? description
					: `${description} (${currentInstallment}/${installments})`;

			entries.push(
				new Entry(
					dashboard,
					currentInstallmentDate,
					type,
					currentInstallmentDescription,
					category,
					paymentType,
					installmentAmount
				)
			);
		}

		return entries;
	}

	public get month(): number {
		return this._month;
	}

	public get year(): number {
		return this._year;
	}

	public get date(): Date {
		return this._date;
	}

	public get type(): EntryType {
		return this._type;
	}

	public get description(): string {
		return this._description;
	}

	public get category(): string {
		return this._category;
	}

	public get paymentType(): string {
		return this._paymentType;
	}

	public get amount(): number {
		return this._amount;
	}

	update({
		date,
		type,
		description,
		category,
		paymentType,
		amount,
	}: UpdateData) {
		if (date) {
			this._date = date;
			this._month = date.getUTCMonth() + 1;
			this._year = date.getFullYear();
		}

		if (type) {
			this._type = type;
		}

		if (description) {
			this._description = description;
		}

		if (category) {
			this._category = category;
		}

		if (paymentType) {
			this._paymentType = paymentType;
		}

		if (amount) {
			this._amount = amount;
		}
	}
}

export type EntryType = 'cost' | 'income';

type UpdateData = {
	date?: Date;
	type?: EntryType;
	description?: string;
	category?: string;
	paymentType?: string;
	amount?: number;
};
