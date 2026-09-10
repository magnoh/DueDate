import React from 'react';
import { useDemands } from '../../hooks/useDemands';
import { DemandTable } from '../../components/demands/DemandTable';
import { DemandFilters } from '../../components/demands/DemandFilters';
import { Button } from '../../components/ui/Button';
import { useUIStore } from '../../store/uiStore';
import { Plus } from 'lucide-react';

export const DemandsPage: React.FC = () => {
  const { data: demandsData, isLoading, isError, refetch } = useDemands();
  const { openCreateModal } = useUIStore();

  const demands = demandsData?.data || [];
  const total = demandsData?.meta?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header com Ação */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-white">Todas as Demandas</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {total}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Filtre por responsável, status ou termo de busca para gerenciar cada item.
          </p>
        </div>

        <Button onClick={openCreateModal} size="md">
          <Plus className="w-4 h-4" />
          Nova Demanda
        </Button>
      </div>

      {/* Barra de Filtros */}
      <DemandFilters />

      {/* Tratamento de Erro */}
      {isError && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm flex items-center justify-between">
          <span>Não foi possível carregar as demandas no momento.</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Tabela de Dados */}
      <DemandTable demands={demands} isLoading={isLoading} />
    </div>
  );
};
