import UserData from '../../../domain/entity/UserData';

export default interface Security {
	extract(token: string): Promise<UserData | null>;
}
