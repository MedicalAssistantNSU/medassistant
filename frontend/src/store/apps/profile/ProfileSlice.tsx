import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from 'src/store/Store';
import axios from '../../../utils/axios';

const API_URL = '/api/v1/account/';
// 
interface StateType {
  profile: any;
  uploadedFiles: any[];
}

const initialState = {
    profile: {},
    uploadedFiles: [],
};

export const ProfileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    getProfile: (state: StateType, action) => {
      state.profile = action.payload;
    },
    getUploadedFiles: (state: StateType, action) => {
      state.uploadedFiles = action.payload
    },
    AppendFile: (state: StateType, action) => {
      state.uploadedFiles = state.uploadedFiles.concat([action.payload]);
    },
  },
});

export const { getProfile, getUploadedFiles, AppendFile } = ProfileSlice.actions;

export const fetchProfile = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`${API_URL}` + `profile`);
    dispatch(getProfile(response.data.profile));
  } catch (err: any) {
    throw new Error(err);
  }
};

export const fetchUploadedFiles = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.get(`${API_URL}` + `profile/files`);
    dispatch(getUploadedFiles(response.data.data));
  } catch (err: any) {
    throw new Error(err);
  }
};


export default ProfileSlice.reducer;