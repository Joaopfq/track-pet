import { configureStore } from '@reduxjs/toolkit'
import locationReducer from './features/location/locationSlice'
import searchReducer from './features/search/searchSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      location: locationReducer,
      search: searchReducer, 
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']