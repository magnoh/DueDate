import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DemandStats } from '../../types/demand';

interface DemandPieChartProps {
  stats?: DemandStats;
}

export const DemandPieChart: React.FC<DemandPieChartProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
        Carregando gráfico...
      </div>
    );
  }

  const data = [
    { name: 'Aberto', value: stats.pending, color: '#2B7FFF' },
    { name: 'Em andamento', value: stats.inProgress, color: '#EF9F27' },
    { name: 'Concluído', value: stats.completed, color: '#97C459' },
  ];

  const total = stats.pending + stats.inProgress + stats.completed;

  if (total === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
        Nenhuma demanda para exibir no gráfico
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0];
                const pct = total > 0 ? Math.round(((item.value as number) / total) * 100) : 0;
                return (
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '6px 10px',
                      fontSize: 12,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: item.payload.color }}>
                      {item.name}:
                    </span>{' '}
                    <span>{item.value} ({pct}%)</span>
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
            formatter={(value, entry: any) => (
              <span style={{ color: 'var(--text)', fontSize: 12, marginRight: 8 }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
