import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProfile = createAsyncThunk(
    'users/fetchProfile',
    async () => {
        const response = await axios.get(`${import.meta.env.VITE_IP}/api/profile`, {
            withCredentials: true,
        });
        return response.data;
    }
);

const profileAdapter = createEntityAdapter({
    selectId: (e) => 'profile'
});

const profileSlice = createSlice({
    name: 'profile',
    initialState: profileAdapter.getInitialState({
        loadingStatus: 'idle',
        error: null,
    }),
    reducers: {
        updateProfileField: (state, action) => {
            const { id, value } = action.payload;
            if (state.entities[id]) {
                state.entities[id] = { ...value }
            }
        },
        addProfile: (state, action) => {
            const { profile } = action.payload;
            console.log(state.entities.profile);

            state.entities.profile = profile;
        },
        setImage: (state, action) => {
            const { profile } = action.payload
            console.log(state.entities.profile, profile)

            state.entities.profile.profile.banner = profile.banner
            state.entities.profile.profile.avatar = profile.avatar
        },
        deletebook: (state, action) => {
            const { bookid } = action.payload
            state.entities.profile.reviews = state.entities.profile.reviews.filter(book => book._id !== bookid)
        },
        resetProfile: (state) => {
            state.entities = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loadingStatus = 'loading';
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                profileAdapter.addOne(state, action.payload);
                state.loadingStatus = 'idle';
                // console.log(action.payload);
                state.error = null;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loadingStatus = 'failed';
                state.error = action.error
            });
    },
});

export default profileSlice.reducer;
export const { updateProfileField, addProfile, resetProfile, deletebook, setImage } = profileSlice.actions;