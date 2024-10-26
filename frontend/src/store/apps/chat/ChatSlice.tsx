import axios from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from 'src/store/Store';
import { uniqueId } from 'lodash';
import { sub } from 'date-fns';

const API_URL = '/api/v1/chats/';
// 
interface StateType {
  chats: any[];
  chatContent: number;
  chatSearch: string;
}

const initialState = {
  chats: [],
  chatContent: 1,
  chatSearch: '',
};

export const ChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    getChats: (state, action) => {
      state.chats = action.payload;
    },
    SearchChat: (state, action) => {
      state.chatSearch = action.payload;
    },
    SelectChat: (state: StateType, action) => {
      state.chatContent = action.payload;
    },
    sendMsg: (state: StateType, action) => {
      const conversation = action.payload;
      const { id, msg } = conversation;

      state.chats = state.chats.map((chat) =>
        chat.id === id
          ? {
              ...chat,
              ...chat.messages.push(msg),
            }
          : chat,
      );
    },
  },
});

export const { SearchChat, getChats, sendMsg, SelectChat } = ChatSlice.actions;

export const fetchChats = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`${API_URL}`);
    dispatch(getChats(response.data.data));
  } catch (err: any) {
    throw new Error(err);
  }
};

export const addMsg = (chat_id: number, id: number, msg: string) => async (dispatch: AppDispatch) => {
  try {
    const newMessage = {
      id: id,
      content: msg,
      type: 'text',
      createdAt: sub(new Date(), { seconds: 1 }),
      senderId: uniqueId(),
    };
    const response = await axios.post("/api/v1/chats/" + chat_id + "/", newMessage);
    console.log(response)
    dispatch(sendMsg({id: chat_id, msg: newMessage}));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default ChatSlice.reducer;