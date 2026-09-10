import React from 'react';
import { DemandItem, DemandStatus } from '../../types/demand';
import { formatShortDate, getStatusClass } from '../../lib/utils';
import { useUIStore } from '../../store/uiStore';
import { useUpdateDemandStatus } from '../../hooks/useDemands';

interface DemandTableProps {
  demands: DemandItem[];
  total?: number;
  isLoading?: boolean;
}

export const DemandTable: React.FC<DemandTableProps> = ({ demands, total, isLoading }) => {
  const { openEditModal } = useUIStore();
  const updateStatusMutation = useUpdateDemandStatus();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>, id: string) => {
    e.stopPropagation();
    const newStatus = e.target.value as DemandStatus;
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="table-wrap p-8 text-center bg-white">
        <p className="text-sm text-[var(--text-secondary)]">Carregando demandas...</p>
      </div>
    );
  }

  if (demands.length === 0) {
    return (
      <div className="table-wrap p-8 text-center bg-white">
        <p className="text-sm text-[var(--text-secondary)]">Nenhuma demanda encontrada.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-wrap">
        <table className="mockup-table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Responsável</th>
              <th>Prazo</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {demands.map((demand) => {
              const statusClass = getStatusClass(demand.status);

              return (
                <tr
                  key={demand.id}
                  className={`${demand.isOverdue ? 'overdue' : ''} hover:bg-black/[0.02] cursor-pointer transition-colors`}
                  onClick={() => openEditModal(demand)}
                  title="Clique para editar"
                >
                  <td className="font-medium text-[var(--text)]">
                    {demand.description}
                  </td>
                  <td className="text-[var(--text)]">
                    {demand.responsible}
                  </td>
                  <td>
                    {demand.isOverdue ? (
                      <span className="overdue-date">
                        ⚠ {formatShortDate(demand.dueDate)}
                      </span>
                    ) : (
                      <span className="text-[var(--text)]">
                        {formatShortDate(demand.dueDate)}
                      </span>
                    )}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className={`status-select ${statusClass}`}
                      value={demand.status}
                      onChange={(e) => handleStatusChange(e, demand.id)}
                    >
                      <option value="PENDING">Aberto</option>
                      <option value="IN_PROGRESS">Em andamento</option>
                      <option value="COMPLETED">Concluído</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="footer-note">
        Mostrando {demands.length} de {total ?? demands.length} demandas
      </div>
    </>
  );
};
