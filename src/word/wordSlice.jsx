import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  words: [],
  correct_words: [],
  false_words: [],
}

const wordSlice = createSlice({
  name: "word",
  initialState,
  reducers: {},
})

export default wordSlice.reducer
