export class UserModel {
    constructor(
        public id: string
    ) { }

    toFirestore(): any {
        return {
            id: this.id
        };
    }
}