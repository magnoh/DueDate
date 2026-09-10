import React from 'react';
import { useDemandsFilterStore } from '../../store/demandsStore';
import { useResponsibles } from '../../hooks/useDemands';
import { DemandStatus } from '../../types/demand';

export const DemandFilters: React.FC = () => {
  const { status, responsible, setStatus, setResponsible } = useDemandsFilterStore();
  const { data: responsibles = [] } = useResponsibles();

  const handleChipClick = (chipStatus: DemandStatus) => {
    if (status === chipStatus) {
      setStatus('ALL');
    } else {
      setStatus(chipStatus);
    }
  };

  return (
    <div className="filters-bar">
      <select
        className="select-custom"
        value={responsible}
        onChange={(e) => setResponsible(e.target.value)}
      >
        <option value="">Responsável: todos</option>
        {responsibles.map((resp) => (
          <option key={resp} value={resp}>
            {resp}
          </option>
        ))}
      </select>

      <button
        type="button"
        className={`chip blue ${status === 'PENDING' ? 'active font-semibold ring-1 ring-[#85B7EB]' : 'opacity-80 hover:opacity-100'}`}
        onClick={() => handleChipClick('PENDING')}
      >
        Aberto
      </button>

      <button
        type="button"
        className={`chip amber ${status === 'IN_PROGRESS' ? 'active font-semibold ring-1 ring-[#EF9F27]' : 'opacity-80 hover:opacity-100'}`}
        onClick={() => handleChipClick('IN_PROGRESS')}
      >
        Em andamento
      </button>

      <button
        type="button"
        className={`chip green ${status === 'COMPLETED' ? 'active font-semibold ring-1 ring-[#97C459]' : 'opacity-80 hover:opacity-100'}`}
        onClick={() => handleChipClick('COMPLETED')}
      >
        Concluído
      </button>
    </div>
  );
};

