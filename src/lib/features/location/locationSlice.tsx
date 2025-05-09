import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LocationState {
  latitude: number | null
  longitude: number | null
}

const initialState: LocationState = {
  latitude: null,
  longitude: null
}

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<LocationState>) => {
      state.latitude = action.payload.latitude
      state.longitude = action.payload.longitude
    },
    clearLocation: () => initialState // Reset to initial state
  }
})

export const { setLocation, clearLocation } = locationSlice.actions
export default locationSlice.reducer