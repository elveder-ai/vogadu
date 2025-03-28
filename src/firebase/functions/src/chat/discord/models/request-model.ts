import { InteractionType } from 'discord-interactions';

export interface RequestModel {
    type: InteractionType,
    data: DataModel,
    token: string,
    member: MemberModel | undefined,
    user: UserModel | undefined
}

export interface DataModel {
    id: string,
    name: string,
    type: number,
    options: OptionsModel[]
}

export interface OptionsModel {
    name: string,
    type: number,
    value: string
}

export interface MemberModel {
    user: UserModel;
}

export interface UserModel {
    id: string;
}