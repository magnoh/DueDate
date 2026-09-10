import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { demandFormSchema, DemandFormData } from '../../schemas/demand.schema';
import { useUIStore } from '../../store/uiStore';
import { useCreateDemand, useUpdateDemand, useResponsibles } from '../../hooks/useDemands';
import { DemandStatus } from '../../types/demand';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export const DemandFormModal: React.FC = () => {
  const { isFormModalOpen, closeFormModal, selectedDemand, formMode } = useUIStore();
  const createMutation = useCreateDemand();
  const updateMutation = useUpdateDemand();
  const { data: responsibles = [] } = useResponsibles();

  const isEditing = formMode === 'EDIT' && !!selectedDemand;

  // Formatar dueDate para YYYY-MM-DD para o input HTML date
  const defaultDueDate = selectedDemand?.dueDate
    ? new Date(selectedDemand.dueDate).toISOString().split('T')[0]
    : '';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<DemandFormData>({
    resolver: zodResolver(demandFormSchema),
    values: isEditing
      ? {
          description: selectedDemand.description,
          responsible: selectedDemand.responsible,
          dueDate: defaultDueDate,
          status: selectedDemand.status,
        }
      : {
          description: '',
          responsible: '',
          dueDate: '',
          status: 'PENDING',
        },
  });

  const onSubmit = async (data: DemandFormData) => {
    if (isEditing && selectedDemand) {
      await updateMutation.mutateAsync({
        id: selectedDemand.id,
        data: {
          description: data.description,
          responsible: data.responsible,
          dueDate: new Date(data.dueDate).toISOString(),
          status: data.status,
        },
      });
    } else {
      await createMutation.mutateAsync({
        description: data.description,
        responsible: data.responsible,
        dueDate: new Date(data.dueDate).toISOString(),
        status: data.status,
      });
      reset();
    }
  };

  const currentStatus = watch('status');

  const statusList: { value: DemandStatus; label: string }[] = [
    { value: 'PENDING', label: 'Aberto' },
    { value: 'IN_PROGRESS', label: 'Em andamento' },
    { value: 'COMPLETED', label: 'Concluído' },
  ];

  if (!isFormModalOpen) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Descrição */}
      <div className="field">
        <label>Descrição *</label>
        <input
          type="text"
          placeholder="Ex.: Revisar contrato com fornecedor"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-[var(--red-text)] mt-1 font-medium">{errors.description.message}</p>
        )}
      </div>

      {/* Responsável */}
      <div className="field">
        <label>Responsável *</label>
        <select {...register('responsible')}>
          <option value="">Selecionar pessoa</option>
          {responsibles.map((resp) => (
            <option key={resp} value={resp}>
              {resp}
            </option>
          ))}
          {/* Se a pessoa atual não estiver na lista (ex: edição) */}
          {selectedDemand?.responsible && !responsibles.includes(selectedDemand.responsible) && (
            <option value={selectedDemand.responsible}>{selectedDemand.responsible}</option>
          )}
        </select>
        {errors.responsible && (
          <p className="text-xs text-[var(--red-text)] mt-1 font-medium">{errors.responsible.message}</p>
        )}
      </div>

      {/* Prazo */}
      <div className="field">
        <label>Prazo *</label>
        <input type="date" {...register('dueDate')} />
        {errors.dueDate && (
          <p className="text-xs text-[var(--red-text)] mt-1 font-medium">{errors.dueDate.message}</p>
        )}
      </div>

      {/* Status */}
      <div className="field">
        <label>Status</label>
        <div className="status-options">
          {statusList.map((item) => (
            <div
              key={item.value}
              className={`opt ${currentStatus === item.value ? 'selected' : ''}`}
              onClick={() => setValue('status', item.value)}
            >
              {item.label}
            </div>
          ))}
        </div>
        {errors.status && (
          <p className="text-xs text-[var(--red-text)] mt-1 font-medium">{errors.status.message}</p>
        )}
      </div>

      {/* Ações */}
      <div className="drawer-actions">
        <button type="button" className="btn" onClick={closeFormModal}>
          Cancelar
        </button>
        <button
          type="submit"
          className="btn primary"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};
