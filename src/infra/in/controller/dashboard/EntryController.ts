import CreateEntry from '../../../../application/CreateEntry';
import DeleteEntry from '../../../../application/DeleteEntry';
import GetEntries from '../../../../application/GetEntries';
import UpdateEntry from '../../../../application/UpdateEntry';
import UserData from '../../../../domain/entity/UserData';
import RepositoryFactory from '../../../../domain/repository/RepositoryFactory';
import Http from '../../http/Http';

export default class EntryController {
	constructor(private readonly repositoryFactory: RepositoryFactory) {}

	list = async (userData: UserData, params: any) => {
		let input = {
			user: userData,
			dashboard: params['dashboard'],
			month: params['month'],
			year: params['year'],
		};
		let output = await new GetEntries(this.repositoryFactory).execute(input);
		return output.entries;
	};

	save = async (userData: UserData, params: any, body: BodySave) => {
		let input = {
			user: userData,
			dashboard: params['dashboard'],
			...body,
			date: new Date(body.date),
		};
		let output = await new CreateEntry(this.repositoryFactory).execute(input);
		return {
			output: output,
			status: 201,
		};
	};

	update = async (userData: UserData, params: any, body: BodyUpdate) => {
		let entryId = params['id'] as string;
		let dashboard = params['dashboard'] as string;
		let input = {
			user: userData,
			dashboard,
			...body,
			date: new Date(body.date),
			id: entryId,
		};
		await new UpdateEntry(this.repositoryFactory).execute(input);
	};

	delete = async (userData: UserData, params: any) => {
		let entryId = params['id'] as string;
		let dashboard = params['dashboard'] as string;
		let input = {
			user: userData,
			dashboard,
			entry: entryId,
		};
		await new DeleteEntry(this.repositoryFactory).execute(input);
	};

	public bind(http: Http) {
		http.on('get', '/dashboard/{dashboard}/entries', this.list);
		http.on('post', '/dashboard/{dashboard}/entries', this.save);
		http.on('put', '/dashboard/{dashboard}/entries/{id}', this.update);
		http.on('delete', '/dashboard/{dashboard}/entries/{id}', this.delete);
	}
}

type BodySave = {
	date: string;
	description: string;
	type: 'cost' | 'income';
	category: string;
	paymentType: string;
	installments: number;
	amount: number;
};

type BodyUpdate = {
	date: string;
	description: string;
	type: 'cost' | 'income';
	category: string;
	paymentType: string;
	amount: number;
};
