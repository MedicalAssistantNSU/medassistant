type attachType = {
    icon?: string;
    file?: string;
    fileSize?: string;
  };
  
export type MessageType = {
    createdAt?: any;
    content: string;
    image?: string;
    senderId: number | string;
    type: string;
    attachment?: attachType[];
    id: string;
  };
  
  export interface ChatsType {
    id: number | string;
    name: string;
    chatHistory?: any[];
    messages: MessageType[];
  }
  