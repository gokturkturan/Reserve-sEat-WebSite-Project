import { RESERVATIONS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const reservationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    makeReservation: builder.mutation({
      query: (reservation) => ({
        url: `${RESERVATIONS_URL}/makeReservation`,
        method: "POST",
        body: reservation,
      }),
    }),
    getMyReservations: builder.query({
      query: () => ({
        url: `${RESERVATIONS_URL}/myReservations`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetMyReservationsQuery, useMakeReservationMutation } =
  reservationApiSlice;
