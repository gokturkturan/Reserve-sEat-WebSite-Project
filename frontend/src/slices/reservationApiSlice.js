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
    getRestaurantReservations: builder.query({
      query: ({ keyword, pageNumber, date }) => ({
        url: `${RESERVATIONS_URL}/getRestaurantReservations`,
        params: { keyword, pageNumber, date },
      }),
      providesTags: ["Reservations"],
      keepUnusedDataFor: 5,
    }),
    approveReservation: builder.mutation({
      query: (rezId) => ({
        url: `${RESERVATIONS_URL}/${rezId}/approve`,
        method: "PUT",
      }),
    }),
    declineReservation: builder.mutation({
      query: (rezId) => ({
        url: `${RESERVATIONS_URL}/${rezId}/decline`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetMyReservationsQuery,
  useMakeReservationMutation,
  useGetRestaurantReservationsQuery,
  useApproveReservationMutation,
  useDeclineReservationMutation,
} = reservationApiSlice;
