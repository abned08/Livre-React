import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import * as api from '../../api'

export const fetchCommunes = createAsyncThunk(
    'commune/fetchAll',
    async () => {
        const response = await api.fetchCommunes()
        return response.data
    }
)
export const addCommune = createAsyncThunk(
    'commune/add',
    async (newCommune, {rejectWithValue}) => {
            try {
                const data = await api.createCommune(newCommune)
                return data
            } catch (error) {
                return rejectWithValue(error?.response?.data.fieldsMessage)
            }
    }
)
export const updCommune = createAsyncThunk(
    'commune/update',
    async (uCommune, {rejectWithValue}) => {
            try {
                const data = await api.updateCommune(uCommune)
                return data
            } catch (error) {
                return rejectWithValue(error?.response?.data.fieldsMessage)
            }
    }
)

export const deleteCommune = createAsyncThunk(
    'commune/delete',
    async (communeId, {rejectWithValue}) => {
            try {
                const data = await api.deleteCommune(communeId)
                return data
            } catch (error) {
                return rejectWithValue(error?.response?.data.fieldsMessage)
            }
    }
)

const communeSlice = createSlice({
    name: 'communes',
    initialState: {communes: [], loading: false, error: null, success: false},
    reducers: {},
    extraReducers: {
        [fetchCommunes.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.communes = payload
        },
        [fetchCommunes.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [fetchCommunes.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
            state.communes = []
        },
        [addCommune.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.success = true
            state.communes.push(payload.data)

        },
        [addCommune.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success = false
        },
        [addCommune.rejected]: (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.payload ? action.payload : action.error.message
        },
        [updCommune.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.success = true
            const dsData =payload.data
            const dsState=state.communes.find(des=>des.id ===dsData.id)
            state.communes.splice(state.communes.indexOf(dsState), 1, dsData)
        },
        [updCommune.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success = false
        },
        [updCommune.rejected]: (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.payload ? action.payload : action.error.message
        },
        [deleteCommune.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.success = true
            const dsState=state.communes.find(des=>des.id ===payload.data)
            state.communes.splice(state.communes.indexOf(dsState), 1)

        },
        [deleteCommune.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success = false
        },
        [deleteCommune.rejected]: (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.payload ? action.payload : action.error.message
        }
    }
})

export default communeSlice.reducer
