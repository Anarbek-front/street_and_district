import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { api } from '../../api/axios'
import type { SearchAndMatchesResult } from '../../types/search'
import type { District } from '../../types/district'
import type { DistrictAndStreets } from '../../types/district_and_streets'
import type { SearchFormValue } from '../../types/searchForm'

type SearchState = {
    searchData: SearchAndMatchesResult[]
    districts: District[]
    districtsAndStreets: SearchAndMatchesResult[]
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
export const streetSearch = createAsyncThunk<
    SearchAndMatchesResult[],
    SearchFormValue,
    { rejectValue: string }
>('get/streetSearch', async (data, { rejectWithValue }) => {
    try {
        const response = await api.get<SearchAndMatchesResult[]>('/search', {
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
    SearchAndMatchesResult[],
    void,
    { rejectValue: string }
>('get/districts_streets', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get<DistrictAndStreets[]>('/matches')

        const changedData = data.map(({ id, streetName, districtName }) => ({
            id,
            street: streetName,
            district: districtName,
        }))
        return changedData
    } catch {
        return rejectWithValue('Ошибка загрузки районов и улиц')
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
            .addCase(streetSearch.fulfilled, (state, action) => {
                state.loading = false
                state.searchData = action.payload
            })
            .addCase(getDistricts.fulfilled, (state, action) => {
                state.loading = false
                state.districts = action.payload
            })
            .addCase(getDistrictsAndStreets.fulfilled, (state, action) => {
                state.loading = false
                state.districtsAndStreets = action.payload
            })
            .addMatcher(
                isAnyOf(
                    streetSearch.pending,
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
                    streetSearch.rejected,
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
