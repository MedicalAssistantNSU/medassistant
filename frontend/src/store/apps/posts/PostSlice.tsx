import { createSlice } from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import { AppDispatch } from 'src/store/Store';
import axios from '../../../utils/axios';

const API_URL = '/api/v1/posts/';
// 
interface StateType {
  posts: any[];
  selectedPost: any;
  postSearch: string;
}

const initialState = {
    posts: [],
    selectedPost: {},
    postSearch: "",
};

export const PostSlice = createSlice({
  name: 'postt',
  initialState,
  reducers: {
    getPosts: (state: StateType, action) => {
      state.posts= action.payload;
    },
    AppendPost: (state: StateType, action) => {
      state.posts = state.posts.concat([action.payload]);
    },
    SearchPost: (state: StateType, action) => {
      state.postSearch = action.payload;
    },
    SelectPost: (state: StateType, action) => {
      state.selectedPost = action.payload;
    },
  },
});

export const { getPosts, AppendPost, SearchPost, SelectPost} = PostSlice.actions;

export const fetchPosts = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`${API_URL}`);
    dispatch(getPosts(response.data.data));
  } catch (err: any) {
    throw new Error(err);
  }
};


export default PostSlice.reducer;