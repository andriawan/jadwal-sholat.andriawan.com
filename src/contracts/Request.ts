export default interface Request {
	fetch(requester: string): Promise<any>;
}
