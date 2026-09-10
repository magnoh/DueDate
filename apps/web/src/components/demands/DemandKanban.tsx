import React, { useState } from 'react';
import { DemandItem, DemandStatus } from '../../types/demand';
import { useDemands, useUpdateDemandStatus } from '../../hooks/useDemands';
import { useUIStore } from '../../store/uiStore';
import { Clock, AlertTriangle, User, Calendar, GripVertical } from 'lucide-react';

interface ColumnConfig {
  status: DemandStatus;
  title: string;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    status: 'PENDING',
    title: 'Aberto',
    dotColor: '#2b7fff',
    badgeBg: 'var(--blue-bg)',
    badgeText: 'var(--blue-text)',
  },
  {
    status: 'IN_PROGRESS',
    title: 'Em andamento',
    dotColor: '#ef9f27',
    badgeBg: 'var(--amber-bg)',
    badgeText: 'var(--amber-text)',
  },
  {
    status: 'COMPLETED',
    title: 'Concluído',
    dotColor: '#97c459',
    badgeBg: 'var(--green-bg)',
    badgeText: 'var(--green-text)',
  },
];

export const DemandKanban: React.FC = () => {
  const { data, isLoading } = useDemands();
  const updateStatusMutation = useUpdateDemandStatus();
  const { openEditModal } = useUIStore();

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<DemandStatus | null>(null);

  const demands = data?.data || [];

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedId(id);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverCol(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, colStatus: DemandStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colStatus) {
      setDragOverCol(colStatus);
    }
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: DemandStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const demandId = e.dataTransfer.getData('text/plain');

    if (!demandId) return;

    const currentDemand = demands.find((d) => d.id === demandId);
    if (currentDemand && currentDemand.status !== targetStatus) {
      updateStatusMutation.mutate({ id: demandId, status: targetStatus });
    }
    setDraggedId(null);
  };

  const formatDate = (dateString: string | Date) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
        Carregando demandas...
      </div>
    );
  }

  return (
    <div className="kanban-board">
      {COLUMNS.map((col) => {
        const colDemands = demands.filter((d) => d.status === col.status);
        const isOver = dragOverCol === col.status;

        return (
          <div
            key={col.status}
            className={`kanban-column ${isOver ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.status)}
          >
            {/* Column Header */}
            <div className="kanban-column-header">
              <div className="kanban-column-title">
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: col.dotColor,
                    display: 'inline-block',
                  }}
                />
                <span>{col.title}</span>
              </div>
              <span className="kanban-column-badge">{colDemands.length}</span>
            </div>

            {/* Column Cards */}
            <div className="kanban-column-cards">
              {colDemands.length === 0 ? (
                <div className="kanban-empty">Nenhuma demanda</div>
              ) : (
                colDemands.map((demand) => {
                  const isDragging = draggedId === demand.id;

                  return (
                    <div
                      key={demand.id}
                      className={`kanban-card ${isDragging ? 'is-dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, demand.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => openEditModal(demand)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="kanban-card-desc">{demand.description}</div>
                        <GripVertical
                          size={14}
                          className="text-[#9A9C93] flex-shrink-0 cursor-grab hover:text-[#23261F]"
                          style={{ marginTop: 2 }}
                        />
                      </div>

                      {demand.isOverdue && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: 'var(--red-bg)',
                            color: 'var(--red-text)',
                            fontSize: 11,
                            fontWeight: 600,
                            marginBottom: 8,
                          }}
                        >
                          <AlertTriangle size={11} />
                          Vencida
                        </div>
                      )}

                      <div className="kanban-card-footer">
                        <div className="flex items-center gap-1.5" title="Responsável">
                          <User size={12} className="text-[#9A9C93]" />
                          <span style={{ fontWeight: 500 }}>{demand.responsible}</span>
                        </div>

                        <div
                          className="flex items-center gap-1"
                          title="Data de entrega"
                          style={{
                            color: demand.isOverdue ? 'var(--red-text)' : 'inherit',
                            fontWeight: demand.isOverdue ? 600 : 'normal',
                          }}
                        >
                          <Calendar size={12} className="text-[#9A9C93]" />
                          <span>{formatDate(demand.dueDate)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
