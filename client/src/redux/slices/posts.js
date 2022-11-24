import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk('posts/fetchPosts', () => {
    return axios.get('/posts')
        .then(response => response.data)
        .catch(error => console.error(error))
});

export const fetchTags = createAsyncThunk('posts/fetchTags', () => {
    return axios.get('/tags')
        .then(response => response.data)
        .catch(error => console.error(error))
});

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) =>
    axios.delete(`/posts/${id}`));

export const fetchComments = createAsyncThunk('posts/fetchComments', async (id) => {
    const {data} = await axios.get(`/posts/${id}/get-comment`);
    return data
});

const initialState = {
    posts: {
        items: [],
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    },
    comments: {
        items: [],
        status: 'loading'
    }
};

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {},
    extraReducers: {
        [fetchPosts.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = 'loading';
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'loaded';
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = 'error';
        },
        [fetchTags.pending]: (state) => {
            state.tags.items = [];
            state.tags.status = 'loading';
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'loaded';
        },
        [fetchTags.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = 'error';
        },

        [fetchRemovePost.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg);
            state.tags.status = 'loading';
        },

        [fetchComments.pending]: (state) => {
            state.tags.items = [];
            state.tags.status = 'loading';
        },
        [fetchComments.fulfilled]: (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'loaded';
        },
        [fetchComments.rejected]: (state) => {
            state.tags.items = [];
            state.tags.status = 'error';
        },
    }
});

export const postsReducer = postsSlice.reducer;