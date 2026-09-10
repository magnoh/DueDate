export type DemandStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface DemandItem {
  id: string;
  description: string;
  responsible: string;
  dueDate: string;
  status: DemandStatus;
  isOverdue: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DemandStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface ResponsibleStats {
  responsible: string;
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface ListDemandsResponse {
  data: DemandItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreateDemandPayload {
  description: string;
  responsible: string;
  dueDate: string;
  status?: DemandStatus;
}

export interface UpdateDemandPayload {
  description?: string;
  responsible?: string;
  dueDate?: string;
  status?: DemandStatus;
}
