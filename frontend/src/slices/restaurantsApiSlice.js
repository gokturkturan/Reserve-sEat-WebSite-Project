import { RESTAURANTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const restaurantsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurants: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: `${RESTAURANTS_URL}`,
        params: { keyword, pageNumber },
      }),
      providesTags: ["Restaurant"],
      keepUnusedDataFor: 5,
    }),
    getRestaurant: builder.query({
      query: (restaurantId) => ({ url: `${RESTAURANTS_URL}/${restaurantId}` }),
      keepUnusedDataFor: 5,
    }),
    sendRestaurantReview: builder.mutation({
      query: (data) => ({
        url: `${RESTAURANTS_URL}/${data.restaurantId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Restaurant"],
    }),
    createBranch: builder.mutation({
      query: () => ({
        url: `${RESTAURANTS_URL}/createBranch`,
        method: "POST",
      }),
      invalidatesTags: ["Restaurant"],
    }),
    editBranch: builder.mutation({
      query: (data) => ({
        url: `${RESTAURANTS_URL}/createBranch`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Restaurant"],
    }),
    getBranches: builder.query({
      query: () => ({
        url: `${RESTAURANTS_URL}/getBranches`,
      }),
      providesTags: ["Restaurant"],
      keepUnusedDataFor: 5,
    }),
    deleteBranch: builder.mutation({
      query: (restaurantId) => ({
        url: `${RESTAURANTS_URL}/deleteBranch/${restaurantId}`,
        method: "DELETE",
      }),
    }),
    updateBranch: builder.mutation({
      query: (data) => ({
        url: `${RESTAURANTS_URL}/branch/${data.branchId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Restaurant"],
    }),
    getBranch: builder.query({
      query: (branchId) => ({ url: `${RESTAURANTS_URL}/branch/${branchId}` }),
      keepUnusedDataFor: 5,
    }),
    uploadRestaurantImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetRestaurantsQuery,
  useGetRestaurantQuery,
  useSendRestaurantReviewMutation,
  useCreateBranchMutation,
  useEditBranchMutation,
  useGetBranchesQuery,
  useDeleteBranchMutation,
  useUpdateBranchMutation,
  useGetBranchQuery,
  useUploadRestaurantImageMutation,
} = restaurantsApiSlice;
