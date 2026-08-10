import { useQuery } from "@tanstack/react-query";
import { getMyBookingsApi } from "@/api/booking";
import type { MyBookingsResponse } from "@/lib/types";

export const useMyBookings = (page: number) => {
  return useQuery<MyBookingsResponse>({
    queryKey: ["myBookings", page],
    queryFn: async () => {
      const response = await getMyBookingsApi(page);

      return response.data;
    },
  });
};