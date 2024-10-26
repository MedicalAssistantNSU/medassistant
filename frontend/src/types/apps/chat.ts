type attachType = {
    icon?: string;
    file?: string;
    fileSize?: string;
  };
  
  type MessageType = {
    createdAt?: any;
    content: string;
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
  