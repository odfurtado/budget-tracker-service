import Category from '../../../../src/domain/entity/Category';

describe('Entity.Category', () => {
	test('Should create a generic category', () => {
		var name = 'Fun';
		var category = new Category(null, name);
		expect(category.id).not.toBeNull();
		expect(category.dashboard).toBeNull();
		expect(category.name).toBe(name);
	});

	test('Should create an user category ', () => {
		var dashboard = 'dashboard-111';
		var name = 'Fun';
		var category = new Category(dashboard, name);
		expect(category.id).not.toBeNull();
		expect(category.dashboard).toBe(dashboard);
		expect(category.name).toBe(name);
	});
});
