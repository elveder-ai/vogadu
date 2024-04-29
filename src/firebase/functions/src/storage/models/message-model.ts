export class MessageModel {
    static readonly USER_ID_PROPERTY = 'userId';
    static readonly SESSION_ID_PROPERTY = 'sessionId';
    static readonly TIMESTAMP_PROPERTY = 'timestamp';

    constructor(
        public userId: string,
        public sessionId: string,
        public timestamp: Date,
        public request: string,
        public response: string
    ) { }

    toFirestore(): any {
        return {
            userId: this.userId,
            sessionId: this.sessionId,
            timestamp: this.timestamp,
            request: this.request,
            response: this.response
        };
    }
}