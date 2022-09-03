import PaymentType from '../../../../src/domain/entity/PaymentType';

test('should create a payment type', () => {
	var name = 'Credit Card';

	var paymentType = new PaymentType(name);
	expect(paymentType.id).not.toBeNull();
	expect(paymentType.name).toBe(name);
});
