
export enum MessageType {
    ASK,
    ANSWER,
}

export interface Message {
    type: string,
    content: string,
    timestamp: string,
}
