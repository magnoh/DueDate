import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useDemandStatsByResponsible } from '../../hooks/useDemands';

export const DemandBarChart: React.FC = () => {
  const { data, isLoading } = useDemandStatsByResponsible();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
        Carregando dados por responsável...
      </div>
    );
  }

  // Pegar top 6 responsáveis com mais demandas
  const chartData = (data || []).slice(0, 6).map((item) => ({
    name: item.responsible.length > 12 ? `${item.responsible.substring(0, 10)}...` : item.responsible,
    fullName: item.responsible,
    Aberto: item.pending,
    'Em andamento': item.inProgress,
    Concluído: item.completed,
    Total: item.total,
  }));

  if (chartData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
        Nenhuma demanda por responsável encontrada
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E6E1" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#62655C' }}
            axisLine={{ stroke: '#DDDEDA' }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: '#62655C' }}
            axisLine={{ stroke: '#DDDEDA' }}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const fullItem = chartData.find((d) => d.name === label);
                return (
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '8px 12px',
                      fontSize: 12,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text)' }}>
                      {fullItem?.fullName || label}
                    </div>
                    {payload.map((p: any) => (
                      <div
                        key={p.name}
                        style={{ display: 'flex', justifyContent: 'space-between', gap: 12, color: p.color }}
                      >
                        <span>{p.name}:</span>
                        <span style={{ fontWeight: 600 }}>{p.value}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span style={{ color: 'var(--text)', fontSize: 12, marginRight: 8 }}>
                {value}
              </span>
            )}
          />
          <Bar dataKey="Aberto" stackId="a" fill="#2B7FFF" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Em andamento" stackId="a" fill="#EF9F27" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Concluído" stackId="a" fill="#97C459" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
