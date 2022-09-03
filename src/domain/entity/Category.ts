import { v4 as uuidv4 } from 'uuid';

export default class Category {
	id: string;

	constructor(
		readonly dashboard: string | null,
		readonly name: string,
		id?: string
	) {
		this.id = id ? id : uuidv4();
	}
}
