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
}

interface PostbackModel {
    mid: string;
    text: string;
}
