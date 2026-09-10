import { create } from 'zustand';
import { DemandItem } from '../types/demand';

interface UIState {
  activePage: 'DASHBOARD' | 'DEMANDS';
  demandsView: 'TABLE' | 'KANBAN';
  isFormModalOpen: boolean;
  isStatusModalOpen: boolean;
  selectedDemand: DemandItem | null;
  formMode: 'CREATE' | 'EDIT';
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | null;
  setActivePage: (page: 'DASHBOARD' | 'DEMANDS') => void;
  setDemandsView: (view: 'TABLE' | 'KANBAN') => void;
  openCreateModal: () => void;
  openEditModal: (demand: DemandItem) => void;
  closeFormModal: () => void;
  openStatusModal: (demand: DemandItem) => void;
  closeStatusModal: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activePage: 'DEMANDS',
  demandsView: 'TABLE',
  isFormModalOpen: false,
  isStatusModalOpen: false,
  selectedDemand: null,
  formMode: 'CREATE',
  toastMessage: null,
  toastType: null,

  setActivePage: (activePage) => set({ activePage }),
  setDemandsView: (demandsView) => set({ demandsView }),

  openCreateModal: () =>
    set({
      isFormModalOpen: true,
      selectedDemand: null,
      formMode: 'CREATE',
    }),

  openEditModal: (demand) =>
    set({
      isFormModalOpen: true,
      selectedDemand: demand,
      formMode: 'EDIT',
    }),

  closeFormModal: () =>
    set({
      isFormModalOpen: false,
      selectedDemand: null,
    }),

  openStatusModal: (demand) =>
    set({
      isStatusModalOpen: true,
      selectedDemand: demand,
    }),

  closeStatusModal: () =>
    set({
      isStatusModalOpen: false,
      selectedDemand: null,
    }),

  showToast: (message, type = 'success') =>
    set({
      toastMessage: message,
      toastType: type,
    }),

  hideToast: () =>
    set({
      toastMessage: null,
      toastType: null,
    }),
}));
