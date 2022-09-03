import Entry from '../../../../src/domain/entity/Entry';

describe('Entity.Entry', () => {
	test('Should create a cost entry', () => {
		let dashboard = 'userId-1111';
		let date = new Date('2022-08-02');
		let description = 'ice cream';
		let category = 'fun';
		let paymentType = 'credit';
		let amount = 87.36;
		let entry = new Entry(
			dashboard,
			date,
			'cost',
			description,
			category,
			paymentType,
			amount
		);
		expect(entry.id).not.toBeNull();
		expect(entry.dashboard).toBe(dashboard);
		expect(entry.month).toBe(8);
		expect(entry.year).toBe(2022);
		expect(entry.date).toBe(date);
		expect(entry.type).toBe('cost');
		expect(entry.description).toBe(description);
		expect(entry.category).toBe(category);
		expect(entry.paymentType).toBe(paymentType);
		expect(entry.amount).toBe(amount);
	});

	test('Should create an income entry ', () => {
		let dashboard = 'userId-1111';
		let date = new Date('2022-11-01');
		let description = 'ice cream';
		let category = 'fun';
		let paymentType = 'credit';
		let amount = 87.36;
		let entry = new Entry(
			dashboard,
			date,
			'income',
			description,
			category,
			paymentType,
			amount
		);
		expect(entry.id).not.toBeNull();
		expect(entry.dashboard).toBe(dashboard);
		expect(entry.month).toBe(11);
		expect(entry.year).toBe(2022);
		expect(entry.date).toBe(date);
		expect(entry.type).toBe('income');
		expect(entry.description).toBe(description);
		expect(entry.category).toBe(category);
		expect(entry.paymentType).toBe(paymentType);
		expect(entry.amount).toBe(amount);
	});

	test('Should update an entry', () => {
		let dashboard = 'userId-1111';
		let date = new Date('2022-11-01');
		let description = 'ice cream';
		let category = 'fun';
		let paymentType = 'credit';
		let amount = 87.36;
		let entry = new Entry(
			dashboard,
			date,
			'income',
			description,
			category,
			paymentType,
			amount
		);
		let userData = {
			id: 'userId-1111',
			name: '',
			email: '',
		};
		let updateData = {
			date: new Date('2023-12-01'),
			type: 'cost' as 'cost',
			description: 'theather',
			category: 'fun',
			paymentType: 'credit_card',
			amount: 1000,
		};
		entry.update(updateData);
		expect(entry.id).not.toBeNull();
		expect(entry.dashboard).toBe(dashboard);
		expect(entry.month).toBe(updateData.date.getUTCMonth() + 1);
		expect(entry.year).toBe(updateData.date.getUTCFullYear());
		expect(entry.date).toStrictEqual(updateData.date);
		expect(entry.type).toBe(updateData.type);
		expect(entry.description).toBe(updateData.description);
		expect(entry.category).toBe(updateData.category);
		expect(entry.paymentType).toBe(updateData.paymentType);
		expect(entry.amount).toBe(updateData.amount);
	});
});
