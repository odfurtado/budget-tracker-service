import GetUserInformation from '../../../application/GetUserInformation';
import UserData from '../../../domain/entity/UserData';
import RepositoryFactory from '../../../domain/repository/RepositoryFactory';
import Http from '../http/Http';

export default class MeController {
	constructor(private readonly repositoryFactory: RepositoryFactory) {}

	getUserInformation = async (userData: UserData) => {
		let userInformation = await new GetUserInformation(
			this.repositoryFactory
		).execute({
			user: userData,
		});
		return userInformation;
	};

	bind(http: Http) {
		http.on('get', '/me', this.getUserInformation);
	}
}
