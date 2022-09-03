import UserData from '../../../domain/entity/UserData';

export default interface Http {
	on(method: string, url: string, callback: CallbackFunction): void;
	secure(validator: any): void;
	listen(port: number): void;
}

export type ResponseData = {
	output?: any;
	status?: number;
};

export type CallbackOutput = Promise<ResponseData | any>;

export type CallbackFunction = (
	userData: UserData,
	params: any,
	body: any
) => CallbackOutput;
