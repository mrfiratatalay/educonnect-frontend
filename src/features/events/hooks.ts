import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelEvent,
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  registerEvent,
  updateEvent,
} from "@/features/events/api";
import type { AppEvent, CreateEventInput, EventFilters, UpdateEventInput } from "@/features/events/types";

export const eventKeys = {
  all: ["events"] as const,
  list: (groupId?: string) => [...eventKeys.all, "list", groupId ?? "all"] as const,
  detail: (eventId: string) => [...eventKeys.all, "detail", eventId] as const,
};

export function useEventsQuery(filters: EventFilters = {}, enabled = true) {
  return useQuery({
    queryKey: eventKeys.list(filters.groupId),
    queryFn: (): Promise<AppEvent[]> => getEvents(filters),
    enabled,
  });
}

export function useEventDetailQuery(eventId?: string, enabled = true) {
  return useQuery({
    queryKey: eventId ? eventKeys.detail(eventId) : [...eventKeys.all, "detail"],
    queryFn: (): Promise<AppEvent> => getEvent(eventId!),
    enabled: enabled && Boolean(eventId),
  });
}

export function useCreateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEventInput) => createEvent(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: eventKeys.all });
    },
  });
}

export function useUpdateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateEventInput) => updateEvent(input),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventKeys.all }),
        queryClient.invalidateQueries({ queryKey: eventKeys.detail(variables.eventId) }),
      ]);
    },
  });
}

export function useDeleteEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSuccess: async (_, eventId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventKeys.all }),
        queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) }),
      ]);
    },
  });
}

export function useRegisterEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => registerEvent(eventId),
    onSuccess: async (_, eventId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventKeys.all }),
        queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) }),
      ]);
    },
  });
}

export function useCancelEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => cancelEvent(eventId),
    onSuccess: async (_, eventId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: eventKeys.all }),
        queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) }),
      ]);
    },
  });
}
