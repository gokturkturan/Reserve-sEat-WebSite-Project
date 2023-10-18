import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("reservation")
  ? JSON.parse(localStorage.getItem("reservation"))
  : { reservationInfos: {} };

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    saveReservationInfos: (state, actions) => {
      state.reservationInfos = actions.payload;
      localStorage.setItem("reservation", JSON.stringify(state));
    },
    clearReservation: (state, action) => {
      state.reservationInfos = {};
      localStorage.setItem("reservation", JSON.stringify(state));
    },
    resetReservation: (state) => (state = initialState),
  },
});

export const { saveReservationInfos, resetReservation } =
  reservationSlice.actions;
export default reservationSlice.reducer;
