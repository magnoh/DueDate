import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DemandStatus } from '../types/demand';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatShortDate(dateString: string | Date): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(date);
}

export function getStatusLabel(status: DemandStatus): string {
  switch (status) {
    case 'PENDING':
      return 'Aberto';
    case 'IN_PROGRESS':
      return 'Em andamento';
    case 'COMPLETED':
      return 'Concluído';
    default:
      return status;
  }
}

export function getStatusClass(status: DemandStatus): string {
  switch (status) {
    case 'PENDING':
      return 'aberto';
    case 'IN_PROGRESS':
      return 'andamento';
    case 'COMPLETED':
      return 'concluido';
    default:
      return '';
  }
}

export function getStatusColor(status: DemandStatus): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case 'PENDING':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500',
      };
    case 'IN_PROGRESS':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'COMPLETED':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        dot: 'bg-gray-500',
      };
  }
}
