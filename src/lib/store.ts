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

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']