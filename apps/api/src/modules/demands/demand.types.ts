export type DemandStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface DemandItem {
  id: string;
  description: string;
  responsible: string;
  dueDate: string | Date;
  status: DemandStatus;
  isOverdue: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface DemandFilters {
  status?: DemandStatus;
  responsible?: string;
  search?: string;
  page?: number;
  limit?: number;
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
