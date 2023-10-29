import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import * as api from "../../../../api";

export const fetchDecisionNames = createAsyncThunk(
    'decisionName/fetchAll',
    async () => {
        const response = await api.fetchDecisionNames()
        return response.data
    }
)
export const addDecisionName = createAsyncThunk(
    'decisionName/add',
    async (newDecisionName, {rejectWithValue}) => {
        try {
            const data = await api.createDecisionName(newDecisionName)
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data.fieldsMessage)
        }
    }
)
export const updDecisionName = createAsyncThunk(
    'decisionName/update',
    async (uDecisionName, {rejectWithValue}) => {
        try {
            const data = await api.updateDecisionName(uDecisionName)
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data.fieldsMessage)
        }
    }
)

export const deleteDecisionName = createAsyncThunk(
    'decisionName/delete',
    async (decisionNameId, {rejectWithValue}) => {
        try {
            const data = await api.deleteDecisionName(decisionNameId)
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data.fieldsMessage)
        }
    }
)
const decisionNameSlice = createSlice({
    name: 'decisionNames',
    initialState: {decisionNames: [], loading: false, error: null, success: false},
    reducers: {},
    extraReducers: {
        [fetchDecisionNames.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.decisionNames = payload
        },
        [fetchDecisionNames.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [fetchDecisionNames.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
            state.decisionNames = []
        },
        [addDecisionName.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.success = true
            state.decisionNames.push(payload.data)

        },
        [addDecisionName.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success = false
        },
        [addDecisionName.rejected]: (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.payload ? action.payload : action.error.message
        },
        [updDecisionName.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.success = true
            const dsData =payload.data
            const dsState=state.decisionNames.find(des=>des.id ===dsData.id)
            state.decisionNames.splice(state.decisionNames.indexOf(dsState), 1, dsData)
        },
        [updDecisionName.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success = false
        },
        [updDecisionName.rejected]: (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.payload ? action.payload : action.error.message
        },
        [deleteDecisionName.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.success = true
            const dsState=state.decisionNames.find(des=>des.id ===payload.data)
            state.decisionNames.splice(state.decisionNames.indexOf(dsState), 1)

        },
        [deleteDecisionName.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success = false
        },
        [deleteDecisionName.rejected]: (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.payload ? action.payload : action.error.message
        }
    }
})

export default decisionNameSlice.reducer
