import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DemandTable } from '../components/demands/DemandTable';
import { DemandItem } from '../types/demand';

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe('DemandTable Component', () => {
  it('deve renderizar a tabela com as demandas passadas', () => {
    const mockDemands: DemandItem[] = [
      {
        id: 'demand-1',
        description: 'Implementar funcionalidade de autenticação',
        responsible: 'Dev Júnior',
        dueDate: '2026-09-20T18:00:00.000Z',
        status: 'IN_PROGRESS',
        isOverdue: false,
        createdAt: '2026-09-10T10:00:00.000Z',
        updatedAt: '2026-09-10T10:00:00.000Z',
      },
      {
        id: 'demand-2',
        description: 'Conciliar planilha fiscal',
        responsible: 'Ana Paula',
        dueDate: '2026-08-15T18:00:00.000Z',
        status: 'PENDING',
        isOverdue: true,
        createdAt: '2026-08-01T10:00:00.000Z',
        updatedAt: '2026-08-01T10:00:00.000Z',
      },
    ];

    renderWithClient(<DemandTable demands={mockDemands} />);

    expect(screen.getByText('Implementar funcionalidade de autenticação')).toBeInTheDocument();
    expect(screen.getByText('Dev Júnior')).toBeInTheDocument();
    expect(screen.getByText('Conciliar planilha fiscal')).toBeInTheDocument();
    expect(screen.getByText('Ana Paula')).toBeInTheDocument();

    // Valida indicador de atraso ⚠
    expect(screen.getByText(/⚠/)).toBeInTheDocument();
  });

  it('deve renderizar o empty state quando a lista for vazia', () => {
    renderWithClient(<DemandTable demands={[]} />);
    expect(screen.getByText(/Nenhuma demanda encontrada/)).toBeInTheDocument();
  });
});

