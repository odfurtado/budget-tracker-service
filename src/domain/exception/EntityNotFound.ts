export default class EntityNotFound extends Error {
	constructor(entity: string) {
		super(`${entity} not found`);
	}
}
