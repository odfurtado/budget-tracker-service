import { v4 as uuidv4 } from 'uuid';

export default class PaymentType {
	id: string;

	constructor(readonly name: string, id?: string) {
		this.id = id ? id : uuidv4();
	}
}
