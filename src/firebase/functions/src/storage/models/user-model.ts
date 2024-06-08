export class UserModel {
    constructor(
        public id: string,
        public humanInteraction: boolean
    ) { }

    toFirestore(): any {
        return {
            id: this.id,
            humanInteraction: this.humanInteraction
        };
    }
}