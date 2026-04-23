import { apiClient } from "@/lib/axios";
import { ApiError, ApiResponse, HTTPMethod } from "@/types/types";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

// Generic GET hook
export function useGetQuery<TData>(
  queryKey: string | readonly unknown[],
  url: string,
  options?: UseQueryOptions<ApiResponse<TData>, AxiosError<ApiError>>
) {
  const formattedKey = Array.isArray(queryKey) ? queryKey : [queryKey];
  return useQuery<ApiResponse<TData>, AxiosError<ApiError>>({
    queryKey: formattedKey,
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<TData>>(url);
      return data;
    },
    ...options,
    staleTime: 5 * 60 * 1000,
  });
}

// Generic POST mutation
export function usePostMutation<TData, TPayload>(url: string) {
  return useMutation<ApiResponse<TData>, AxiosError<ApiError>, TPayload>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.post<ApiResponse<TData>>(url, payload);
      return data;
    },
  });
}

// Generic PUT mutation
export function usePutMutation<TData, TPayload>(url: string) {
  return useMutation<ApiResponse<TData>, AxiosError<ApiError>, TPayload>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.put<ApiResponse<TData>>(url, payload);
      return data;
    },
  });
}

// Generic Delete mutation

export function useDeleteMutation() {
  return useMutation<ApiResponse<unknown>, AxiosError<ApiError>, string>({
    mutationFn: async (url: string) => {
      const { data } = await apiClient.delete<ApiResponse<unknown>>(url);
      return data;
    },
  });
}

// Generic hook for any HTTP method
export function useApiMutation<TData, TPayload>(
  method: HTTPMethod,
  url: string
) {
  return useMutation<ApiResponse<TData>, AxiosError<ApiError>, TPayload>({
    mutationFn: async (payload) => {
      const { data } = await apiClient.request<ApiResponse<TData>>({
        method,
        url,
        data: method !== "GET" ? payload : undefined,
        params: method === "GET" ? payload : undefined,
      });
      return data;
    },
  });
}
