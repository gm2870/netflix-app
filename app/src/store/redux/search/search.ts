import { createSlice } from '@reduxjs/toolkit';
import { Media } from '../media/model';
type InitialState = {
  param: string;
  result: Media[];
};
const initialState: InitialState = {
  param: '',
  result: [],
};
const searchSlice = createSlice({
  name: 'searchParams',
  initialState,
  reducers: {
    searchParam: (state, action) => {
      state.param = action.payload;
    },
    setResult: (state, action) => {
      state.result = action.payload;
    },
  },
});

export const { searchParam, setResult } = searchSlice.actions;
export default searchSlice;
