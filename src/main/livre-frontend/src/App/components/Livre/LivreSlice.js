import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import * as api from '../../api'

export const fetchLivres = createAsyncThunk(
    'livre/fetchAll',
    async () => {
        const response = await api.fetchLivres()
        return response.data
    }
)

export const lastLivre = createAsyncThunk(
    'livre/lastLivr',
    async () => {
        const response = await api.lastLivre()
        return response.data
    }
)

export const matchLivre = createAsyncThunk(
    'livre/matchLivre',
    async (mtchLivre) => {
        const response = await api.matchLivre(mtchLivre)
        return response.data
    }
)

export const matchRecArngNumLivre = createAsyncThunk(
    'livre/matchRecArngNumLivre',
    async (mtchLivre) => {
        const response = await api.matchRecArngNumLivre(mtchLivre)
        return response.data
    }
)

export const addLivre = createAsyncThunk(
    'livre/add',
    async (newLivre,{ rejectWithValue }) => {
        try {
            return await api.createLivre(newLivre)
        } catch (error) {
            return rejectWithValue(error?.response?.data.fieldsMessage)
        }
    }
)
export const updLivre = createAsyncThunk(
    'livre/update',
    async (uLivre, {rejectWithValue}) => {
        try {
            return await api.updateLivre(uLivre)
        } catch (error) {
            return rejectWithValue(error?.response?.data.fieldsMessage)
        }
    }
)

export const deleteLivre = createAsyncThunk(
    'livre/delete',
    async (livreId, {rejectWithValue}) => {
        try {
            return await api.deleteLivre(livreId)
        } catch (error) {
            return rejectWithValue(error?.response?.data.fieldsMessage)
        }
    }
)


const livreSlice = createSlice({
    name: 'livres',
    initialState: { livres: [], lastL:0,mtchLivre:null, mtchRecArngNumLivre:null, loading: false, error: null, success:false },
    reducers: {
    },
    extraReducers: {
        [fetchLivres.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.livres = payload
        },
        [fetchLivres.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [fetchLivres.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
            state.livres = []
        },
        [lastLivre.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.lastL = payload
        },
        [lastLivre.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [lastLivre.rejected]: (state, action) => {
            state.loading = false
        },
        [matchLivre.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.mtchLivre = payload
        },
        [matchLivre.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [matchLivre.rejected]: (state, action) => {
            state.loading = false
        },
        [matchRecArngNumLivre.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.mtchRecArngNumLivre = payload
        },
        [matchRecArngNumLivre.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [matchRecArngNumLivre.rejected]: (state, action) => {
            state.loading = false
        },
        [addLivre.fulfilled]: (state, action) => {
            state.loading = false
            state.error = null
            state.success=true
        },
        [addLivre.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success=false
        },
        [addLivre.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload ? action.payload : action.error.message
            state.success=false
        },
        [updLivre.fulfilled]: (state, action) => {
            state.loading = false
            state.error = null
            state.success=true

        },
        [updLivre.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success=false
        },
        [updLivre.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload ? action.payload : action.error.message
            state.success=false
        },
        [deleteLivre.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            const lvState=state.livres.find(lvr=>lvr.id ===payload.data)
            state.livres.splice(state.livres.indexOf(lvState), 1)
        },
        [deleteLivre.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [deleteLivre.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload ? action.payload : action.error.message
        }
    }
})

export default livreSlice.reducer
