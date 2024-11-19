import axios from '../../../utils/axios';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from 'src/store/Store';
import { toNumber, uniqueId } from 'lodash';
import { sub } from 'date-fns';

const API_URL = '/api/v1/chats/';
// 
interface StateType {
  chats: any[];
  chatContent: number;
  chatSearch: string;
  scans: any[];
}

const initialState = {
  chats: [],
  chatContent: 1,
  chatSearch: '',
  scans: [],
};

export const ChatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    getChats: (state: StateType, action) => {
      state.chats = action.payload;
    },
    getScans: (state: StateType, action) => {
      state.scans = action.payload;
    },
    AppendChat: (state: StateType, action) => {
      state.chats = state.chats.concat([action.payload]);
    },
    SearchChat: (state: StateType, action) => {
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

export const { SearchChat, getChats, sendMsg, SelectChat, AppendChat, getScans} = ChatSlice.actions;

export const fetchChats = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`${API_URL}`);
    dispatch(getChats(response.data.data));
  } catch (err: any) {
    throw new Error(err);
  }
};

export const fetchScans = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get("/api/v1/scans/");
    dispatch(getScans(response.data.messages));
    console.log(response.data.messages)
  } catch (err: any) {
    throw new Error(err);
  }
};

export const addMsg = (chat_id: number, type: string, msg: string) => async (dispatch: AppDispatch) => {
  try {
    const newMessage = {
      content: msg,
      type: type,
      createdAt: sub(new Date(), { seconds: 1 }),
    };
    dispatch(sendMsg({id: chat_id, msg: newMessage}));
    const response = await axios.post("/api/v1/chats/" + chat_id + "/", newMessage);
    console.log(response)
    
    dispatch(sendMsg({id: chat_id, msg: response.data.data}));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default ChatSlice.reducer;