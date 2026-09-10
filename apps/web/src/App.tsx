import React from 'react';
import { DemandFilters } from './components/demands/DemandFilters';
import { DemandTable } from './components/demands/DemandTable';
import { DemandKanban } from './components/demands/DemandKanban';
import { DemandFormModal } from './components/demands/DemandForm';
import { DashboardPage } from './pages/Dashboard';
import { Modal } from './components/ui/Modal';
import { Toast } from './components/ui/Toast';
import { useUIStore } from './store/uiStore';
import { useDemandsFilterStore } from './store/demandsStore';
import { useDemands, useDemandStats } from './hooks/useDemands';
import { LayoutDashboard, CheckSquare, Table, Columns3 } from 'lucide-react';

export function App() {
  const {
    activePage,
    demandsView,
    setActivePage,
    setDemandsView,
    isFormModalOpen,
    closeFormModal,
    openCreateModal,
    formMode,
  } = useUIStore();

  const { activeTab, setActiveTab } = useDemandsFilterStore();
  const { data: demandsResponse, isLoading } = useDemands();
  const { data: stats } = useDemandStats();

  const overdueCount = stats?.overdue ?? 0;

  return (
    <div className="app-container">
      {/* Top bar */}
      <div className="topbar">
        <div className="flex items-center gap-6">
          <div className="brand cursor-pointer" onClick={() => setActivePage('DEMANDS')}>
            <span className="mark">O</span> ORION — Controle de demandas
          </div>

          {/* Navigation between Dashboard and Demands */}
          <div className="topbar-nav">
            <button
              type="button"
              className={`topbar-nav-item ${activePage === 'DEMANDS' ? 'active' : ''}`}
              onClick={() => setActivePage('DEMANDS')}
            >
              <CheckSquare size={14} />
              Demandas
            </button>
            <button
              type="button"
              className={`topbar-nav-item ${activePage === 'DASHBOARD' ? 'active' : ''}`}
              onClick={() => setActivePage('DASHBOARD')}
            >
              <LayoutDashboard size={14} />
              Dashboard
            </button>
          </div>
        </div>

        <div className="avatar" title="Ana Souza (Usuário Atual)">
          AS
        </div>
      </div>

      {/* When Demands page is active */}
      {activePage === 'DEMANDS' && (
        <>
          {/* Toolbar with Filter Tabs + View Toggle + New Demand Action */}
          <div className="toolbar">
            <button
              type="button"
              className={`tab ${activeTab === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveTab('ALL')}
            >
              Todas
            </button>
            <button
              type="button"
              className={`tab ${activeTab === 'MINE' ? 'active' : ''}`}
              onClick={() => setActiveTab('MINE')}
            >
              Minhas demandas
            </button>
            <button
              type="button"
              className={`tab danger ${activeTab === 'OVERDUE' ? 'active' : ''}`}
              onClick={() => setActiveTab('OVERDUE')}
            >
              Vencidas {overdueCount > 0 ? `(${overdueCount})` : ''}
            </button>

            <div className="flex-1" />

            {/* View Mode Toggle: Table / Kanban */}
            <div className="view-toggle">
              <button
                type="button"
                className={`view-toggle-btn ${demandsView === 'TABLE' ? 'active' : ''}`}
                onClick={() => setDemandsView('TABLE')}
                title="Visualização em tabela"
              >
                <Table size={13} />
                Tabela
              </button>
              <button
                type="button"
                className={`view-toggle-btn ${demandsView === 'KANBAN' ? 'active' : ''}`}
                onClick={() => setDemandsView('KANBAN')}
                title="Visualização em kanban"
              >
                <Columns3 size={13} />
                Kanban
              </button>
            </div>

            <button
              type="button"
              className="btn primary"
              onClick={openCreateModal}
            >
              + Nova demanda
            </button>
          </div>

          {/* Filters Bar */}
          <DemandFilters />

          {/* Content: Table or Kanban */}
          {demandsView === 'TABLE' ? (
            <DemandTable
              demands={demandsResponse?.data ?? []}
              total={demandsResponse?.meta.total}
              isLoading={isLoading}
            />
          ) : (
            <DemandKanban />
          )}
        </>
      )}

      {/* When Dashboard is active */}
      {activePage === 'DASHBOARD' && <DashboardPage />}

      {/* Drawer para Criação e Edição */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={closeFormModal}
        title={formMode === 'CREATE' ? 'Nova demanda' : 'Editar demanda'}
      >
        <DemandFormModal />
      </Modal>

      {/* Notificações Toast */}
      <Toast />
    </div>
  );
}

export default App;
