export class PubSubMessageModel {
    constructor(
        public input: string,
        public token: string,
        public userId: string
    ) { }
}