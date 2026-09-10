import { PrismaClient, DemandStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpa registros anteriores para permitir reexecução idempotente
  await prisma.demand.deleteMany();

  const demandsData: Array<{
    description: string;
    responsible: string;
    dueDate: Date;
    status: DemandStatus;
  }> = [
    {
      description: 'Implementar dashboard de controle com métricas em tempo real',
      responsible: 'João Silva',
      dueDate: new Date('2026-09-25T18:00:00Z'),
      status: 'IN_PROGRESS',
    },
    {
      description: 'Criar documentação completa da API REST e endpoints',
      responsible: 'Maria Oliveira',
      dueDate: new Date('2026-09-28T18:00:00Z'),
      status: 'PENDING',
    },
    {
      description: 'Corrigir fluxo de cadastro e validação de campos vazios',
      responsible: 'Carlos Santos',
      dueDate: new Date('2026-09-05T18:00:00Z'),
      status: 'COMPLETED',
    },
    {
      description: 'Revisar relatório mensal de conciliação fiscal de despesas',
      responsible: 'Maria Oliveira',
      dueDate: new Date('2026-09-01T18:00:00Z'), // ATRASADA (dueDate < hoje e status != COMPLETED)
      status: 'PENDING',
    },
    {
      description: 'Atualizar contratos sociais e certidões junto a fornecedores',
      responsible: 'Ana Paula Ribeiro',
      dueDate: new Date('2026-08-20T18:00:00Z'), // ATRASADA
      status: 'IN_PROGRESS',
    },
    {
      description: 'Auditar extratos bancários do primeiro trimestre do Projeto Delta',
      responsible: 'Fernanda Lima',
      dueDate: new Date('2026-10-15T18:00:00Z'),
      status: 'PENDING',
    },
    {
      description: 'Mapeamento de despesas e provisões com marketing e eventos',
      responsible: 'Rafael Duarte',
      dueDate: new Date('2026-08-10T18:00:00Z'), // ATRASADA
      status: 'PENDING',
    },
    {
      description: 'Levantamento da relação de licenças de software em vigor',
      responsible: 'Juliana Castro',
      dueDate: new Date('2026-09-08T18:00:00Z'),
      status: 'COMPLETED',
    },
  ];

  for (const item of demandsData) {
    await prisma.demand.create({ data: item });
  }

  const count = await prisma.demand.count();
  console.log(`✅ Seed finalizado! ${count} demandas cadastradas.`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
