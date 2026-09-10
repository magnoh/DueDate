import React from 'react';
import { useDemandStats, useDemands } from '../../hooks/useDemands';
import { DemandPieChart } from '../../components/dashboard/DemandPieChart';
import { DemandBarChart } from '../../components/dashboard/DemandBarChart';
import { useUIStore } from '../../store/uiStore';
import {
  Layers,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading: isStatsLoading } = useDemandStats();
  const { data: demandsData, isLoading: isDemandsLoading } = useDemands();
  const { openCreateModal, openEditModal, setActivePage } = useUIStore();

  const recentDemands = demandsData?.data?.slice(0, 5) || [];

  const formatDate = (dateString: string | Date) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-open">Aberto</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-prog">Em andamento</span>;
      case 'COMPLETED':
        return <span className="badge badge-done">Concluído</span>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* 5 Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card-custom">
          <div className="flex items-center justify-between">
            <span className="label">Total</span>
            <Layers size={14} className="text-[#9A9C93]" />
          </div>
          <span className="value">{isStatsLoading ? '-' : stats?.total ?? 0}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>cadastradas</span>
        </div>

        <div
          className="stat-card-custom"
          style={{ borderLeft: '3px solid #2B7FFF' }}
        >
          <div className="flex items-center justify-between">
            <span className="label">Pendentes</span>
            <Clock size={14} style={{ color: '#2B7FFF' }} />
          </div>
          <span className="value" style={{ color: 'var(--blue-text)' }}>
            {isStatsLoading ? '-' : stats?.pending ?? 0}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>a iniciar</span>
        </div>

        <div
          className="stat-card-custom"
          style={{ borderLeft: '3px solid #EF9F27' }}
        >
          <div className="flex items-center justify-between">
            <span className="label">Em andamento</span>
            <Activity size={14} style={{ color: '#EF9F27' }} />
          </div>
          <span className="value" style={{ color: 'var(--amber-text)' }}>
            {isStatsLoading ? '-' : stats?.inProgress ?? 0}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>em execução</span>
        </div>

        <div
          className="stat-card-custom"
          style={{ borderLeft: '3px solid #97C459' }}
        >
          <div className="flex items-center justify-between">
            <span className="label">Concluídas</span>
            <CheckCircle2 size={14} style={{ color: '#97C459' }} />
          </div>
          <span className="value" style={{ color: 'var(--green-text)' }}>
            {isStatsLoading ? '-' : stats?.completed ?? 0}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>finalizadas</span>
        </div>

        <div
          className="stat-card-custom"
          style={{ borderLeft: '3px solid #F09595' }}
        >
          <div className="flex items-center justify-between">
            <span className="label">Atrasadas</span>
            <AlertTriangle size={14} style={{ color: '#F09595' }} />
          </div>
          <span className="value" style={{ color: 'var(--red-text)' }}>
            {isStatsLoading ? '-' : stats?.overdue ?? 0}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>prazo expirado</span>
        </div>
      </div>

      {/* Gráficos Recharts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-title">
            <div className="flex items-center gap-2">
              <PieIcon size={16} className="text-[#62655C]" />
              <span>Distribuição por Status</span>
            </div>
          </div>
          <DemandPieChart stats={stats} />
        </div>

        <div className="chart-card">
          <div className="chart-card-title">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-[#62655C]" />
              <span>Demandas por Responsável</span>
            </div>
          </div>
          <DemandBarChart />
        </div>
      </div>

      {/* Demandas Recentes */}
      <div className="recent-demands-card">
        <div className="recent-demands-header">
          <span>Demandas Recentes</span>
          <button
            className="btn flex items-center gap-1.5"
            onClick={() => setActivePage('DEMANDS')}
            style={{ fontSize: 12, padding: '5px 10px' }}
          >
            <span>Ver todas as demandas</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {isDemandsLoading ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
            Carregando demandas...
          </div>
        ) : recentDemands.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
            Nenhuma demanda cadastrada
          </div>
        ) : (
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
              {recentDemands.map((demand) => (
                <tr
                  key={demand.id}
                  onClick={() => openEditModal(demand)}
                  style={{ cursor: 'pointer' }}
                  title="Clique para editar"
                >
                  <td style={{ fontWeight: 500 }}>{demand.description}</td>
                  <td>{demand.responsible}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        color: demand.isOverdue ? 'var(--red-text)' : 'inherit',
                        fontWeight: demand.isOverdue ? 600 : 'normal',
                      }}
                    >
                      {formatDate(demand.dueDate)}
                      {demand.isOverdue && <span className="badge badge-late">Vencida</span>}
                    </span>
                  </td>
                  <td>{getStatusBadge(demand.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
