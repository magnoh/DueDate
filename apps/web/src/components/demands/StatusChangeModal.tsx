import React, { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useUpdateDemandStatus } from '../../hooks/useDemands';
import { DemandStatus } from '../../types/demand';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/Badge';

export const StatusChangeModal: React.FC = () => {
  const { isStatusModalOpen, closeStatusModal, selectedDemand } = useUIStore();
  const updateStatusMutation = useUpdateDemandStatus();
  const [selectedStatus, setSelectedStatus] = useState<DemandStatus>(
    selectedDemand?.status || 'PENDING'
  );

  React.useEffect(() => {
    if (selectedDemand) {
      setSelectedStatus(selectedDemand.status);
    }
  }, [selectedDemand]);

  if (!isStatusModalOpen || !selectedDemand) return null;

  const statuses: Array<{ value: DemandStatus; label: string; desc: string }> = [
    {
      value: 'PENDING',
      label: 'Pendente',
      desc: 'Demanda aguardando início de execução',
    },
    {
      value: 'IN_PROGRESS',
      label: 'Em andamento',
      desc: 'Demanda em desenvolvimento ativo',
    },
    {
      value: 'COMPLETED',
      label: 'Concluída',
      desc: 'Demanda finalizada e validada com sucesso',
    },
  ];

  const handleConfirm = async () => {
    await updateStatusMutation.mutateAsync({
      id: selectedDemand.id,
      status: selectedStatus,
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
        <p className="text-xs text-slate-400">Demanda selecionada:</p>
        <p className="text-sm font-medium text-slate-200 line-clamp-2">
          {selectedDemand.description}
        </p>
        <div className="pt-2 flex items-center gap-2">
          <span className="text-xs text-slate-400">Status atual:</span>
          <StatusBadge status={selectedDemand.status} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Novo Status
        </label>
        <div className="space-y-2">
          {statuses.map((s) => {
            const isSelected = selectedStatus === s.value;
            return (
              <div
                key={s.value}
                onClick={() => setSelectedStatus(s.value)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold">{s.label}</div>
                  <div className="text-xs text-slate-400">{s.desc}</div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-blue-400 bg-blue-500' : 'border-slate-600'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
        <Button type="button" variant="outline" onClick={closeStatusModal}>
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          isLoading={updateStatusMutation.isPending}
        >
          Confirmar Alteração
        </Button>
      </div>
    </div>
  );
};
