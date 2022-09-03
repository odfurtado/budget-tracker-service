import { da } from 'date-fns/locale';
import DashboardShare from '../../../../src/domain/entity/DashboardShare';

describe('Entity.DashboardShare', () => {
	test('Share a dashboard with another user', () => {
		let dashboard = 'userId-1111';
		let email = 'validuser@mail.com';
		let dashboardShare = new DashboardShare(dashboard, email);
		expect(dashboardShare.id).not.toBeNull();
		expect(dashboardShare.dashboard).toBe(dashboard);
		expect(dashboardShare.status).toBe('PendingApproval');
		expect(dashboardShare.sharedWithEmail).toBe(email);
		expect(dashboardShare.sharedWithUserId).toBeNull();
		expect(dashboardShare.createdAt).not.toBeNull();
		expect(dashboardShare.approvedAt).toBeNull();
	});

	test('Approve a dashboard share', () => {
		let dashboard = 'userId-1111';
		let sharedWithEmail = 'user02@mail.com';
		let dashboardShare = new DashboardShare(dashboard, sharedWithEmail);
		let user = {
			id: 'userId-2222',
			name: 'User 02',
			email: sharedWithEmail,
		};
		dashboardShare.acceptBy(dashboard, user);
		expect(dashboardShare.id).not.toBeNull();
		expect(dashboardShare.dashboard).toBe(dashboard);
		expect(dashboardShare.status).toBe('Approved');
		expect(dashboardShare.sharedWithEmail).toBe(user.email);
		expect(dashboardShare.sharedWithUserId).toBe(user.id);
		expect(dashboardShare.createdAt).not.toBeNull();
		expect(dashboardShare.approvedAt).not.toBeNull();
	});

	test('Cannot aprove a dashboard share with a status != PendingApproval', () => {
		let dashboard = 'userId-1111';
		let user = {
			id: 'userId-2222',
			name: 'User 02',
			email: 'user02@mail.com',
		};
		let dashboardShare = new DashboardShare(
			dashboard,
			user.email,
			user.id,
			'Approved',
			new Date(),
			new Date()
		);
		expect(() => dashboardShare.acceptBy(dashboard, user)).toThrowError(
			'Cannot accept a dashboard share with status != PendingApproval'
		);
	});

	test('Cannot aprove a dashboard share from other user', () => {
		let dashboard = 'userId-1111';
		let dashboardShare = new DashboardShare(dashboard, 'user02@mail.com');
		let otherUser = {
			id: 'userId-3333',
			name: 'User 03',
			email: 'user03@mail.com',
		};
		expect(() => dashboardShare.acceptBy(dashboard, otherUser)).toThrowError(
			'Invalid access'
		);
	});

	test('Cancel a dashboard share with status == PendingApproval', () => {
		let dashboard = 'userId-1111';
		let sharedWithEmail = 'user02@mail.com';
		let dashboardShare = new DashboardShare(dashboard, sharedWithEmail);
		let user = {
			id: 'userId-2222',
			name: 'User 02',
			email: sharedWithEmail,
		};
		dashboardShare.cancelBy(dashboard, user);
		expect(dashboardShare.id).not.toBeNull();
		expect(dashboardShare.dashboard).toBe(dashboard);
		expect(dashboardShare.status).toBe('Rejected');
		expect(dashboardShare.sharedWithEmail).toBe(user.email);
		expect(dashboardShare.sharedWithUserId).toBeNull();
	});

	test('Cancel a dashboard share with status == Approved', () => {
		let dashboard = 'userId-1111';
		let sharedWithEmail = 'user02@mail.com';
		let dashboardShare = new DashboardShare(
			dashboard,
			sharedWithEmail,
			'userId-2222',
			'Approved'
		);
		let user = {
			id: dashboardShare.sharedWithUserId as string,
			name: 'User 02',
			email: sharedWithEmail,
		};
		dashboardShare.cancelBy(dashboard, user);
		expect(dashboardShare.id).not.toBeNull();
		expect(dashboardShare.dashboard).toBe(dashboard);
		expect(dashboardShare.status).toBe('Cancelled');
		expect(dashboardShare.sharedWithEmail).toBe(user.email);
		expect(dashboardShare.sharedWithUserId).not.toBeNull();
	});

	test('Cannot cancel a dashboard share from other user', () => {
		let dashboard = 'userId-1111';
		let sharedWithEmail = 'user02@mail.com';
		let dashboardShare = new DashboardShare(dashboard, sharedWithEmail);
		let otherUser = {
			id: 'userId-3333',
			name: 'User 03',
			email: 'user03@mail.com',
		};
		expect(() => dashboardShare.cancelBy(dashboard, otherUser)).toThrowError(
			'Invalid access'
		);
	});

	test('Check if current user can share the dashboard', () => {
		let user = {
			id: 'userId-1111',
			name: '',
			email: '',
		};
		let dashboard = 'userId-1111';
		DashboardShare.canBeShared(user, dashboard);
	});

	test('Check if current user cannot share the dashboard', () => {
		let user = {
			id: 'userId-2222',
			name: '',
			email: '',
		};
		let dashboard = 'userId-1111';
		expect(() => DashboardShare.canBeShared(user, dashboard)).toThrow(
			'Invalid access'
		);
	});
});
