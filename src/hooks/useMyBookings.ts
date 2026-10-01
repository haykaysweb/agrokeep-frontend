import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMyBookingsApi, type MyBookingsResponse } from "@/api/booking";

export const useMyBookings = (page: number) => {
  return useQuery<MyBookingsResponse>({
    queryKey: ["myBookings", page],
    queryFn: async () => {
      const response = await getMyBookingsApi(page);

      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};
