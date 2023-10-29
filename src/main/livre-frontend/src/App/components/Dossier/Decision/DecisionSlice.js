import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import * as api from '../../../api'

export const fetchDecisions = createAsyncThunk(
    'decision/fetchAll',
    async (dossierId) => {
        const response = await api.fetchDecisions(dossierId)
        return response.data
    }
)
export const addDecision = createAsyncThunk(
    'decision/add',
    async ({dossierId,newDecision}, {rejectWithValue}) => {
            try {
                const data = await api.createDecision(dossierId, newDecision)
                return data
            } catch (error) {
                return rejectWithValue(error?.response?.data.fieldsMessage)
            }
    }
)
export const updDesicion = createAsyncThunk(
    'decision/update',
    async (uDecision, {rejectWithValue}) => {
            try {
                const data = await api.updateDecision(uDecision)
                return data
            } catch (error) {
                return rejectWithValue(error?.response?.data.fieldsMessage)
            }
    }
)

export const deleteDesicion = createAsyncThunk(
    'decision/delete',
    async (decisionId, {rejectWithValue}) => {
            try {
                const data = await api.deleteDecision(decisionId)
                return data
            } catch (error) {
                return rejectWithValue(error?.response?.data.fieldsMessage)
            }
    }
)


const decisionSlice = createSlice({
    name: 'decisions',
    initialState: {decisions: [], loading: false, error: null, success: false},
    reducers: {},
    extraReducers: {
        [fetchDecisions.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.decisions = payload
        },
        [fetchDecisions.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [fetchDecisions.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
            state.decisions = []
        },
        [addDecision.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.success = true
            state.decisions.push(payload.data)

        },
        [addDecision.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success = false
        },
        [addDecision.rejected]: (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.payload ? action.payload : action.error.message
        },
        [updDesicion.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.success = true
            const dsData =payload.data
            const dsState=state.decisions.find(des=>des.id ===dsData.id)
            state.decisions.splice(state.decisions.indexOf(dsState), 1, dsData)
        },
        [updDesicion.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success = false
        },
        [updDesicion.rejected]: (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.payload ? action.payload : action.error.message
        },
        [deleteDesicion.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.success = true
            const dsState=state.decisions.find(des=>des.id ===payload.data)
            state.decisions.splice(state.decisions.indexOf(dsState), 1)

        },
        [deleteDesicion.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success = false
        },
        [deleteDesicion.rejected]: (state, action) => {
            state.loading = false
            state.success = false
            state.error = action.payload ? action.payload : action.error.message
        }
    }
})

export default decisionSlice.reducer
