import mongoose from 'mongoose';
import DashboardShare from '../../../../domain/entity/DashboardShare';
import DashboardShareRepository from '../../../../domain/repository/DashboardShareRepository';
import DashboardShareSchema from './model/DashboardShareModel';

export default class DashboardShareRepositoryMongoDB
	implements DashboardShareRepository
{
	private readonly DashboardShareModel;
	constructor(private readonly connection: mongoose.Connection) {
		this.DashboardShareModel = connection.model<DashboardShare>(
			'DashboardShare',
			DashboardShareSchema
		);
	}

	async save(dashboardShare: DashboardShare): Promise<void> {
		let dashboardShareModel = await this.DashboardShareModel.findOne({
			id: dashboardShare.id,
		});
		if (!dashboardShareModel) {
			dashboardShareModel = new this.DashboardShareModel({
				id: dashboardShare.id,
				dashboard: dashboardShare.dashboard,
				status: dashboardShare.status,
				sharedWithEmail: dashboardShare.sharedWithEmail,
				sharedWithUserId: dashboardShare.sharedWithUserId,
				createdAt: dashboardShare.createdAt,
				approvedAt: dashboardShare.approvedAt,
			});
			await dashboardShareModel.save();
		} else {
			await dashboardShareModel.updateOne({
				status: dashboardShare.status,
				sharedWithUserId: dashboardShare.sharedWithUserId,
				approvedAt: dashboardShare.approvedAt,
			});
		}
	}

	async get(id: string): Promise<DashboardShare | undefined> {
		let dashboardShareModel = await this.DashboardShareModel.findOne({
			id,
		});
		if (dashboardShareModel) {
			return this.mapModelToEntity(dashboardShareModel);
		}
	}

	async getByUser(userId: string): Promise<DashboardShare[]> {
		let models = await this.DashboardShareModel.find({
			sharedWithUserId: userId,
		});
		return models.map(this.mapModelToEntity);
	}

	async getByEmail(userEmail: string): Promise<DashboardShare[]> {
		let models = await this.DashboardShareModel.find({
			sharedWithEmail: userEmail,
		});
		return models.map(this.mapModelToEntity);
	}

	async getByDashboard(dashboard: string): Promise<DashboardShare[]> {
		let models = await this.DashboardShareModel.find({
			dashboard: dashboard,
		});
		return models.map(this.mapModelToEntity);
	}

	async getCurrent(
		dashboard: string,
		user: string
	): Promise<DashboardShare | undefined> {
		let currentDashboardShare = await this.DashboardShareModel.findOne({
			dashboard,
			sharedWithUserId: user,
			status: 'Approved',
		});
		if (currentDashboardShare) {
			return this.mapModelToEntity(currentDashboardShare);
		}
	}

	private mapModelToEntity(model: Model) {
		return new DashboardShare(
			model.dashboard,
			model.sharedWithEmail,
			model.sharedWithUserId as string,
			model.status,
			model.createdAt,
			model.approvedAt as Date,
			model.id
		);
	}

	//For test only
	async list(): Promise<DashboardShare[]> {
		return await this.DashboardShareModel.find().exec();
	}
	async delete(id: string): Promise<void> {
		await this.DashboardShareModel.deleteOne({ id }).exec();
	}
}

type Model = mongoose.Document<unknown, any, DashboardShare> &
	DashboardShare & {
		_id: mongoose.Types.ObjectId;
	};
