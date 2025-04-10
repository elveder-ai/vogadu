export interface RequestModel {
    object: string;
    entry: EntryModel[];
}

interface EntryModel {
    id: string;
    time: number;
    messaging: MessagingEntryModel[]; // Always contains only one entry
}

interface MessagingEntryModel {
    sender: ParticipantModel;
    recipient: ParticipantModel;
    timestamp: number;
    message: MessageModel | undefined;
    postback: PostbackModel | undefined;
}

interface ParticipantModel {
    id: string;
}

interface MessageModel {
    mid: string;
    text: string;
    commands: CommandModel[] | undefined;
}

interface CommandModel {
    name: string;
}

interface PostbackModel {
    title: string;
    payload: string;
    mid: string;
}
