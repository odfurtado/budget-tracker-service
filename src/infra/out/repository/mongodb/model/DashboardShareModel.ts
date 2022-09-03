import { Schema } from 'mongoose';
import DashboardShare from '../../../../../domain/entity/DashboardShare';

const DashboardShareSchema = new Schema<DashboardShare>({
	id: { type: String, required: true, index: true },
	dashboard: { type: String, index: true },
	status: { type: String, required: true },
	sharedWithEmail: { type: String, index: true, required: true },
	sharedWithUserId: { type: String, index: true },
	createdAt: { type: Date, required: true },
	approvedAt: { type: Date },
});

export default DashboardShareSchema;
