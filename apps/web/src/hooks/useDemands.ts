import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import {
  CreateDemandPayload,
  DemandItem,
  DemandStats,
  DemandStatus,
  ListDemandsResponse,
  ResponsibleStats,
  UpdateDemandPayload,
} from '../types/demand';
import { useDemandsFilterStore } from '../store/demandsStore';
import { useUIStore } from '../store/uiStore';

export function useDemands() {
  const { activeTab, status, responsible, search, currentUser, page, limit } = useDemandsFilterStore();

  return useQuery({
    queryKey: ['demands', { activeTab, status, responsible, search, currentUser, page, limit }],
    queryFn: async () => {
      const params: Record<string, any> = { page, limit };
      if (status !== 'ALL') params.status = status;
      if (responsible) {
        params.responsible = responsible;
      } else if (activeTab === 'MINE') {
        params.responsible = currentUser;
      }
      if (search) params.search = search;
      if (activeTab === 'OVERDUE') {
        params.isOverdue = true;
      }

      const response = await api.get<ListDemandsResponse>('/demands', { params });
      return response.data;
    },
  });
}

export function useDemandStats() {
  return useQuery({
    queryKey: ['demand-stats'],
    queryFn: async () => {
      const response = await api.get<DemandStats>('/demands/stats');
      return response.data;
    },
    refetchInterval: 10000,
  });
}

export function useDemandStatsByResponsible() {
  return useQuery({
    queryKey: ['demand-stats-by-responsible'],
    queryFn: async () => {
      const response = await api.get<{ data: ResponsibleStats[] }>('/demands/stats/by-responsible');
      return response.data.data;
    },
    refetchInterval: 10000,
  });
}

export function useResponsibles() {
  return useQuery({
    queryKey: ['demand-responsibles'],
    queryFn: async () => {
      const response = await api.get<{ data: string[] }>('/demands/responsibles');
      return response.data.data;
    },
  });
}

export function useCreateDemand() {
  const queryClient = useQueryClient();
  const { showToast, closeFormModal } = useUIStore();

  return useMutation({
    mutationFn: async (payload: CreateDemandPayload) => {
      const response = await api.post<DemandItem>('/demands', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
      queryClient.invalidateQueries({ queryKey: ['demand-stats'] });
      queryClient.invalidateQueries({ queryKey: ['demand-stats-by-responsible'] });
      queryClient.invalidateQueries({ queryKey: ['demand-responsibles'] });
      showToast('Demanda criada com sucesso!', 'success');
      closeFormModal();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Erro ao criar demanda';
      showToast(msg, 'error');
    },
  });
}

export function useUpdateDemand() {
  const queryClient = useQueryClient();
  const { showToast, closeFormModal } = useUIStore();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDemandPayload }) => {
      const response = await api.put<DemandItem>(`/demands/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
      queryClient.invalidateQueries({ queryKey: ['demand-stats'] });
      queryClient.invalidateQueries({ queryKey: ['demand-stats-by-responsible'] });
      queryClient.invalidateQueries({ queryKey: ['demand-responsibles'] });
      showToast('Demanda atualizada com sucesso!', 'success');
      closeFormModal();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Erro ao atualizar demanda';
      showToast(msg, 'error');
    },
  });
}

export function useUpdateDemandStatus() {
  const queryClient = useQueryClient();
  const { showToast, closeStatusModal } = useUIStore();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: DemandStatus }) => {
      const response = await api.patch<DemandItem>(`/demands/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demands'] });
      queryClient.invalidateQueries({ queryKey: ['demand-stats'] });
      queryClient.invalidateQueries({ queryKey: ['demand-stats-by-responsible'] });
      showToast('Status alterado com sucesso!', 'success');
      closeStatusModal();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Erro ao alterar status';
      showToast(msg, 'error');
    },
  });
}
