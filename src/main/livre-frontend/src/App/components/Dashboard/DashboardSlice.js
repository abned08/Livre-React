import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import * as api from '../../api'

export const countPerMonths = createAsyncThunk(
    'dossier/countPerMonths',
    async () => {
        const response = await api.countPerMonths()
        return response.data
    }
)
export const totalCountThisYear = createAsyncThunk(
    'dossier/totalCountThisYear',
    async () => {
        const response = await api.totalCountThisYear()
        return response.data
    }
)
export const completedCountThisYear = createAsyncThunk(
    'dossier/completedCountThisYear',
    async () => {
        const response = await api.completedCountThisYear()
        return response.data
    }
)
export const uncompletedCountThisYear = createAsyncThunk(
    'dossier/uncompletedCountThisYear',
    async () => {
        const response = await api.uncompletedCountThisYear()
        return response.data
    }
)
export const rejectedCountThisYear = createAsyncThunk(
    'dossier/rejectedCountThisYear',
    async () => {
        const response = await api.rejectedCountThisYear()
        return response.data
    }
)
export const rejectedTotalCount = createAsyncThunk(
    'dossier/rejectedTotalCount',
    async () => {
        const response = await api.rejectedTotalCount()
        return response.data
    }
)
export const CompletedTotalCount = createAsyncThunk(
    'dossier/completedTotalCount',
    async () => {
        const response = await api.CompletedTotalCount()
        return response.data
    }
)
export const countPerMonthsLivre = createAsyncThunk(
    'livre/countPerMonthsLivre',
    async () => {
        const response = await api.countPerMonthsLivre()
        return response.data
    }
)
export const totalCountThisYearLivre = createAsyncThunk(
    'livre/totalCountThisYear',
    async () => {
        const response = await api.totalCountThisYearLivre()
        return response.data
    }
)
export const deliveredCountThisYearLivre = createAsyncThunk(
    'livre/deliveredCountThisYearLivre',
    async () => {
        const response = await api.deliveredCountThisYearLivre()
        return response.data
    }
)
export const copyCountThisYearLivre = createAsyncThunk(
    'livre/copyCountThisYearLivre',
    async () => {
        const response = await api.copyCountThisYearLivre()
        return response.data
    }
)
export const NotDeliveredCountThisYearLivre = createAsyncThunk(
    'livre/livreNotDeliveredCountThisYear',
    async () => {
        const response = await api.notDeliveredCountThisYear()
        return response.data
    }
)
export const totalCountLivre = createAsyncThunk(
    'livre/totalCount',
    async () => {
        const response = await api.totalCountLivre()
        return response.data
    }
)
export const doublingTotalCountLivre = createAsyncThunk(
    'livre/doublingTotalCountLivre',
    async () => {
        const response = await api.doublingTotalCountLivre()
        return response.data
    }
)

export const fetchEstablishment = createAsyncThunk(
    'dossier/fetchEstablishment',
    async () => {
        const response = await api.fetchEstablishment()
        return response.data
    }
)

export const UrbanTotalCount = createAsyncThunk(
    'dossier/urbanTotalCount',
    async () => {
        const response = await api.urbanTotalCount()
        return response.data
    }
)

export const RuralTotalCount = createAsyncThunk(
    'dossier/ruralTotalCount',
    async () => {
        const response = await api.ruralTotalCount()
        return response.data
    }
)

export const DesertTotalCount = createAsyncThunk(
    'dossier/desertTotalCount',
    async () => {
        const response = await api.desertTotalCount()
        return response.data
    }
)

export const addEstablishment = createAsyncThunk(
    'dossier/addEstablishment',
    async (Establishment,{ rejectWithValue }) => {
        try {
            const data = await api.createEstablishment(Establishment)
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data.fieldsMessage)
        }
    }
)

export const fetchInitStat = createAsyncThunk(
    'dossier/fetchInitStat',
    async () => {
        const response = await api.fetchinitStats()
        return response.data
    }
)

export const addInitStat = createAsyncThunk(
    'dossier/addInitStat',
    async (InitStat,{ rejectWithValue }) => {
        try {
            const data = await api.createinitStats(InitStat)
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data.fieldsMessage)
        }
    }
)

export const periodicCount = createAsyncThunk(
    'dossier/periodic',
    async ({sDate, eDate},{ rejectWithValue }) => {
        try {
            const data = await api.periodicCount(sDate,eDate)
            return data
        } catch (error) {
            return rejectWithValue(error?.response?.data.fieldsMessage)
        }
    }
)

export const FinalTotalCount = createAsyncThunk(
    'dossier/finalTotalCount',
    async () => {
        const response = await api.finalTotalCount()
        return response.data
    }
)
export const TempTotalCount = createAsyncThunk(
    'dossier/tempTotalCount',
    async () => {
        const response = await api.tempTotalCount()
        return response.data
    }
)

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        establishment: [],
        initStats: [],
        periodicStat: [],
        dossierCountPerMonths: [],
        dossierTotalCountThisYear: null,
        dossierCompletedCountThisYear: null,
        dossierUncompletedCountThisYear: null,
        dossierRejectedCountThisYear: null,
        dossierRejectedTotalCount: null,
        dossierCompletedTotalCount: null,
        livrecountPerMonthsLivre: [],
        livretotalCountThisYearLivre: null,
        livredeliveredCountThisYearLivre: null,
        livrecopyCountThisYearLivre: null,
        livreNotDeliveredCountThisYearLivre: null,
        livretotalCountLivre: null,
        livredoublingTotalCountLivre: null,
        urbanTotalCount:null,
        ruralTotalCount:null,
        desertTotalCount:null,
        finalTotalCount:null,
        tempTotalCount:null,
        loading: false, error: null, success:false
    },
    reducers: {},
    extraReducers: {
        [countPerMonths.fulfilled]: (state, {payload}) => {
            state.dossierCountPerMonths = payload
        },
        [totalCountThisYear.fulfilled]: (state, {payload}) => {
            state.dossierTotalCountThisYear = payload
        },
        [completedCountThisYear.fulfilled]: (state, {payload}) => {
            state.dossierCompletedCountThisYear = payload
        },
        [uncompletedCountThisYear.fulfilled]: (state, {payload}) => {
            state.dossierUncompletedCountThisYear = payload
        },
        [rejectedCountThisYear.fulfilled]: (state, {payload}) => {
            state.dossierRejectedCountThisYear = payload
        },
        [rejectedTotalCount.fulfilled]: (state, {payload}) => {
            state.dossierRejectedTotalCount = payload
        },
        [CompletedTotalCount.fulfilled]: (state, {payload}) => {
            state.dossierCompletedTotalCount = payload
        },
        [countPerMonthsLivre.fulfilled]: (state, {payload}) => {
            state.livrecountPerMonthsLivre = payload
        },
        [totalCountThisYearLivre.fulfilled]: (state, {payload}) => {
            state.livretotalCountThisYearLivre = payload
        },
        [deliveredCountThisYearLivre.fulfilled]: (state, {payload}) => {
            state.livredeliveredCountThisYearLivre = payload
        },
        [copyCountThisYearLivre.fulfilled]: (state, {payload}) => {
            state.livrecopyCountThisYearLivre = payload
        },
        [NotDeliveredCountThisYearLivre.fulfilled]: (state, {payload}) => {
            state.livreNotDeliveredCountThisYearLivre = payload
        },
        [totalCountLivre.fulfilled]: (state, {payload}) => {
            state.livretotalCountLivre = payload
        },
        [doublingTotalCountLivre.fulfilled]: (state, {payload}) => {
            state.livredoublingTotalCountLivre = payload
        },
        [fetchEstablishment.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.establishment = payload
        },
        [fetchEstablishment.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [fetchEstablishment.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
            state.dossiers = []
        },
        [addEstablishment.fulfilled]: (state, action) => {
            state.loading = false
            state.error = null
            state.success=true
        },
        [addEstablishment.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success=false
        },
        [addEstablishment.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload ? action.payload : action.error.message
            state.success=false
        },

        [addInitStat.fulfilled]: (state, action) => {
            state.loading = false
            state.error = null
            state.success=true
        },
        [addInitStat.pending]: (state, action) => {
            state.loading = true
            state.error = null
            state.success=false
        },
        [addInitStat.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload ? action.payload : action.error.message
            state.success=false
        },
        [fetchInitStat.fulfilled]: (state, {payload}) => {
            state.loading = false
            state.error = null
            state.initStats = payload
        },
        [fetchInitStat.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [fetchInitStat.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
        },
        [UrbanTotalCount.fulfilled]: (state, {payload}) => {
            state.urbanTotalCount = payload
        },
        [RuralTotalCount.fulfilled]: (state, {payload}) => {
            state.ruralTotalCount = payload
        },
        [DesertTotalCount.fulfilled]: (state, {payload}) => {
            state.desertTotalCount = payload
        },
        [periodicCount.fulfilled]: (state, {payload}) => {
            state.periodicStat = payload.data
            state.loading = false
            state.error = null
        },
        [periodicCount.pending]: (state, action) => {
            state.loading = true
            state.error = null
        },
        [periodicCount.rejected]: (state, action) => {
            state.loading = false
            state.error = action.error.message
        },
        [FinalTotalCount.fulfilled]: (state, {payload}) => {
            state.finalTotalCount = payload
        },
        [TempTotalCount.fulfilled]: (state, {payload}) => {
            state.tempTotalCount = payload
        },

    }
})

export default dashboardSlice.reducer
