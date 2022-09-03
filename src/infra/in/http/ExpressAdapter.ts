import Http, { CallbackFunction } from './Http';
import express, { Response } from 'express';
import bodyParser from 'body-parser';
import Security from '../security/Secutity';
import InvalidAccess from '../../../domain/exception/InvalidAccess';

export default class ExpressAdapter implements Http {
	private app: any;

	constructor() {
		this.app = express();
		this.app.use(bodyParser.json());
	}

	private parseUrl(url: string) {
		return url.replace(/\{/g, ':').replace(/\}/g, '');
	}

	on(method: string, url: string, callback: CallbackFunction): void {
		this.app[method](this.parseUrl(url), async (req: any, res: Response) => {
			try {
				let params = {
					...req.params,
					...req.query,
				};
				const responseData = await callback(req.userData, params, req.body);
				if (responseData && responseData.output) {
					if (responseData?.status) {
						res.status(responseData.status);
					}
					res.json(responseData.output);
				} else {
					res.json(responseData);
				}
			} catch (e: any) {
				if (e instanceof InvalidAccess) {
					res.status(401).json('Invalid access');
					return;
				}
				res.status(500).json(e.message);
			}
		});
	}

	secure(security: Security) {
		this.app.use(async (req: any, res: any, next: any) => {
			let token = req.get('Authorization');
			let userData = await security.extract(token);
			if (!userData) {
				res.status(401).send('Invalid token');
				return;
			}
			req.userData = userData;
			next();
		});
	}

	listen(port: number): void {
		this.app.listen(port, () =>
			console.log(`Server running on port ${port}`)
		);
	}
}
