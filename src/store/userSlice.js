import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUser = createAsyncThunk(
    'users/fetchUser',
    async () => {
        const response = await axios.get(`${import.meta.env.VITE_IP}/api/user`, {
            withCredentials: true,
        })
        return response.data.profile
    }
);

const userAdapter = createEntityAdapter({
    selectId: (e) => e._id
});

const userSlice = createSlice({
    name: 'user',
    initialState: userAdapter.getInitialState({
        loadingStatus: 'idle',
        error: null,
    }),
    reducers: {
        updateUserField: (state, action) => {
            const { id, value } = action.payload;
            if (state.entities[id]) {
                state.entities[id] = { ...value }
            }
        },
        addUser: (state, action) => {
            const { id, user } = action.payload;
            state.entities[id] = user;
        },
        resetUser: (state) => {
            state.entities = {};
        },
    },    
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loadingStatus = 'loading';
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                userAdapter.addOne(state, action.payload);
                state.loadingStatus = 'idle';
                // console.log(action.payload);
                
                state.error = null;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loadingStatus = 'failed';
                // console.log(action.error);
                state.error = action.error
            });
    },
});

export default userSlice.reducer;
export const { updateUserField, addUser, resetUser } = userSlice.actions;