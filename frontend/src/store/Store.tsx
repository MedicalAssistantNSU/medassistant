import { configureStore } from '@reduxjs/toolkit';
import CustomizerReducer from './customizer/CustomizerSlice';
import ChatsReducer from './apps/chat/ChatSlice';
import PostsReducer from './apps/posts/PostSlice';
// import { combineReducers } from 'redux';
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
  TypedUseSelectorHook,
} from 'react-redux';

export const store = configureStore({
  reducer: {
    customizer: CustomizerReducer,
    chatReducer: ChatsReducer,
    postReducer: PostsReducer,
  },
});

// const appReducer = combineReducers({
//   customizer: CustomizerReducer,
//   chatReducer: ChatsReducer,
//   postReducer: PostsReducer,
// });

export const resetStore = () => ({ type: 'RESET' });

// Корневой редьюсер
const rootReducer = (state:any, action:any) => {
  if (action.type === 'RESET') {
    return undefined;
  }
  return state;
};

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const { dispatch } = store;
export const useDispatch = () => useAppDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<AppState> = useAppSelector;

export default store;
