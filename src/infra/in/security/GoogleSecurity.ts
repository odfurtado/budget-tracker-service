import { google } from 'googleapis';
import UserData from '../../../domain/entity/UserData';
import Security from './Secutity';

export default class GoogleSecurity implements Security {
	async extract(token: string): Promise<UserData | null> {
		try {
			const oauth2 = google.oauth2({
				version: 'v2',
				headers: {
					Authorization: token,
				},
			});
			let userInfo = await oauth2.userinfo.get();

			if (userInfo && userInfo.data) {
				return {
					id: userInfo.data.id as string,
					email: userInfo.data.email as string,
					name: userInfo.data.name as string,
				};
			}
		} catch (e: any) {
			console.log('GoogleSecurity.extract :: ERROR :: ', e.message);
		}

		return null;
	}
}
