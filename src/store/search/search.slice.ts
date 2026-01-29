import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import type { SearchResult } from '../../types/search'
import { api } from '../../api/axios'
import type { District } from '../../types/district'
import type { SearchFormValue } from '../../pages/Home'
import type { DistrictAndStreets } from '../../types/district_and_streets'

type SearchState = {
    searchData: SearchResult[]
    districts: District[]
    districtsAndStreets: DistrictAndStreets[]
    loading: boolean
    error: string | null
}

const initialState: SearchState = {
    searchData: [],
    districts: [],
    districtsAndStreets: [],
    loading: false,
    error: null,
}

// поиск
export const axiosSearch = createAsyncThunk<
    SearchResult[],
    SearchFormValue,
    { rejectValue: string }
>('get/axiosSearch', async (data, { rejectWithValue }) => {
    try {
        const response = await api.get<SearchResult[]>('/search', {
            params: data,
        })
        const found = response.data.find(
            (item) => item.district === data.district,
        )
        if (!found) return rejectWithValue('В этом районе нет такой улицы')
        return response.data
    } catch {
        return rejectWithValue('Ошибка поиска')
    }
})

// районы
export const getDistricts = createAsyncThunk<
    District[],
    void,
    { rejectValue: string }
>('get/districts', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get<District[]>('/districts')
        return data
    } catch {
        return rejectWithValue('Ошибка загрузки районов')
    }
})

// все улицы и районы
export const getDistrictsAndStreets = createAsyncThunk<
    DistrictAndStreets[],
    void,
    { rejectValue: string }
>('get/districts_streets', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get<DistrictAndStreets[]>('/matches')
        return data
    } catch {
        return rejectWithValue('Ошибка загрузки районов')
    }
})

const searchSlice = createSlice({
    name: 'get',
    initialState,
    reducers: {
        clearResults: (state) => {
            state.searchData = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(axiosSearch.fulfilled, (state, action) => {
                state.loading = false
                state.searchData = action.payload
            })
            .addCase(getDistricts.fulfilled, (state, action) => {
                state.loading = false
                state.districts = action.payload
            })
            .addCase(getDistrictsAndStreets.fulfilled,(state, action) => {
                state.loading=false
                state.districtsAndStreets = action.payload
            })
            .addMatcher(
                isAnyOf(
                    axiosSearch.pending,
                    getDistricts.pending,
                    getDistrictsAndStreets.pending,
                ),
                (state) => {
                    state.loading = true
                    state.error = null
                },
            )
            .addMatcher(
                isAnyOf(
                    axiosSearch.rejected,
                    getDistricts.rejected,
                    getDistrictsAndStreets.rejected,
                ),
                (state, action) => {
                    state.loading = false
                    state.error = action.payload ?? 'Ошибка'
                },
            )
    },
})

export const { clearResults } = searchSlice.actions
export default searchSlice.reducer
