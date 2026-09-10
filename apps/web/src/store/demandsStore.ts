import { create } from 'zustand';
import { DemandStatus } from '../types/demand';

export type DemandTab = 'ALL' | 'MINE' | 'OVERDUE';

interface DemandsFilterState {
  activeTab: DemandTab;
  status: DemandStatus | 'ALL';
  responsible: string;
  search: string;
  currentUser: string;
  page: number;
  limit: number;
  setActiveTab: (tab: DemandTab) => void;
  setStatus: (status: DemandStatus | 'ALL') => void;
  setResponsible: (responsible: string) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useDemandsFilterStore = create<DemandsFilterState>((set) => ({
  activeTab: 'ALL',
  status: 'ALL',
  responsible: '',
  search: '',
  currentUser: 'Ana Souza',
  page: 1,
  limit: 50,
  setActiveTab: (activeTab) => set({ activeTab, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setResponsible: (responsible) => set({ responsible, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      activeTab: 'ALL',
      status: 'ALL',
      responsible: '',
      search: '',
      page: 1,
    }),
}));
