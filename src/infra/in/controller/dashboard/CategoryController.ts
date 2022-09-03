import CreateCategory from '../../../../application/CreateCategory';
import DeleteCategory from '../../../../application/DeleteCategory';
import GetCategories from '../../../../application/GetCategories';
import UserData from '../../../../domain/entity/UserData';
import RepositoryFactory from '../../../../domain/repository/RepositoryFactory';
import Http from '../../http/Http';

export default class CategoryController {
	constructor(private readonly repositoryFactory: RepositoryFactory) {}

	list = async (userData: UserData, params: any) => {
		let input = {
			user: userData,
			dashboard: params['dashboard'],
		};
		let output = await new GetCategories(this.repositoryFactory).execute(
			input
		);
		return output.categories;
	};

	save = async (userData: UserData, params: any, body: any) => {
		let input = {
			user: userData,
			dashboard: params['dashboard'],
			name: body.name,
		};
		let output = await new CreateCategory(this.repositoryFactory).execute(
			input
		);
		return {
			output: output.id,
			status: 201,
		};
	};

	delete = async (userData: UserData, params: any) => {
		let input = {
			user: userData,
			dashboard: params['dashboard'],
			category: params['id'],
		};
		await new DeleteCategory(this.repositoryFactory).execute(input);
	};

	bind(http: Http) {
		http.on('get', '/dashboard/{dashboard}/categories', this.list);
		http.on('post', '/dashboard/{dashboard}/categories', this.save);
		http.on('delete', '/dashboard/{dashboard}/categories/{id}', this.delete);
	}
}
