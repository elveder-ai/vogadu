export class PubSubMessageModel{
    constructor(
        public senderId: string,
        public sessionId: string,
        public input: string
    ) { }
}