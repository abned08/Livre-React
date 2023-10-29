import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import * as api from '../../api'

export const fetchDossiers = createAsyncThunk(
    'dossier/fetchAll',
    async () => {
        const response = await api.fetchDossiers()
        return response.data
    }
)

export const lastDossier = createAsyncThunk(
    'dossier/lastDoss',
    async () => {
        const response = await api.lastDossier()
        return response.data
    }
)
export const addDossiers = createAsyncThunk(
    'dossier/add',
    async (newDossier,{ rejectWithValue }) => {
        try {
            const data = await api.createDossier(newDossier)
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data.fieldsMessage)
        }
    }
)
export const updDossier = createAsyncThunk(
    'dossier/update',
    async (uDossier, {rejectWithValue}) => {
        try {
            const data = await api.updateDossier(uDossier)
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data.fieldsMessage)
        }
    }
)

export const deleteDossier = createAsyncThunk(
    'dossier/delete',
    async (dossierId, {rejectWithValue}) => {
        try {
            const data = await api.deleteDossier(dossierId)
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data.fieldsMessage)
        }
    }
)

export const printDossier = createAsyncThunk(
    'dossier/print',
    async (dossierId, {rejectWithValue}) => {
        try {
            const data = await api.printDossier(dossierId)
            return data.data
        } catch (error) {
            return rejectWithValue(error?.response?.data.fieldsMessage)
        }
    }
)

export const downloadDossier = createAsyncThunk(
    'dossier/download',
    async (dossierId, {rejectWithValue}) => {
        try {
            const data = await api.downloadDossier(dossierId)
            return data.data
        } catch (error) {
            return rejectWithValue(error?.response)
        }
    }
)

export const checkNumThisYear = createAsyncThunk(
    'dossier/checkNum',
    async (num, {rejectWithValue}) => {
        try {
            const response = await api.checkNumThisYear(num)
            return response.data
        }catch (error) {
            return rejectWithValue(error?.response)
    }
})

export const matchDossierLivre = createAsyncThunk(
    'livre/matchDossierLivre',
    async (mtchLivre) => {
        const response = await api.matchDossierLivre(mtchLivre)
        return response.data
    }
)

export const lastLivreDossier = createAsyncThunk(
    'livre/lastLivreDossier',
    async () => {
        const response = await api.lastLivreDossier()
        return response.data
    }
)

export const matchRecArngNumDossierLivre = createAsyncThunk(
    'livre/matchRecArngNumDossierLivre',
    async (mtchLivre) => {
        const response = await api.matchRecArngNumDossierLivre(mtchLivre)
        return response.data
    }
)

const dossierSlice = createSlice({
    name: 'dossiers',
    initialState: { dossiers: [], lastD:0, lastLD:null, matchDL:null, mtchRecArngNumDL:null, loading: false, error: null, success:false },
    reducers: {

    },
    extraReducers: {
        [fetchDossiers.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.dossiers = payload
        },
        [fetchDossiers.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [fetchDossiers.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
            state.dossiers = []
        },
        [lastDossier.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.lastD = payload
        },
        // [lastDossier.pending]: (state, action) => {
        //     state.loading = true
        //     state.error = null
        // },
        // [lastDossier.rejected]: (state, action) => {
        //     state.loading = false
        //     // state.error = action.error.message
        // },
        [addDossiers.fulfilled]: (state, action) => {
            state.loading = false
            state.error = null
            state.success=true
        },
        [addDossiers.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success=false
        },
        [addDossiers.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload ? action.payload : action.error.message
            state.success=false
        },
        [updDossier.fulfilled]: (state, action) => {
            state.loading = false
            state.error = null
            state.success=true

        },
        [updDossier.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success=false
        },
        [updDossier.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload ? action.payload : action.error.message
            state.success=false
        },
        [deleteDossier.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            const dsState=state.dossiers.find(dos=>dos.id ===payload.data)
            state.dossiers.splice(state.dossiers.indexOf(dsState), 1)

        },
        [deleteDossier.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [deleteDossier.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload ? action.payload : action.error.message
        },
        [downloadDossier.fulfilled]: (state, action) => {
            state.loading = false
            state.error = null
        },
        [downloadDossier.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [downloadDossier.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload ? action.payload : action.error.message
        },
        [printDossier.fulfilled]: (state, action) => {
            state.loading = false
            state.error = null
        },
        [printDossier.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [printDossier.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload ? action.payload : action.error.message
        },
        [matchDossierLivre.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.matchDL = payload
        },
        [lastLivreDossier.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.lastLD = payload
        },
        [matchRecArngNumDossierLivre.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.mtchRecArngNumDL = payload
        },

    }
})

export default dossierSlice.reducer
