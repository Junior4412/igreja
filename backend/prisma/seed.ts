import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpa dados existentes (idempotente)
  await prisma.finance.deleteMany();
  await prisma.event.deleteMany();
  await prisma.member.deleteMany();
  await prisma.cell.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.church.deleteMany();

  // Hash para senha "admin"
  const hashedPassword = await bcrypt.hash('admin', 10);

  // 1. Igreja
  const church = await prisma.church.create({
    data: {
      name: 'Igreja Batista Shalom Ágape',
      address: 'Rua Principal, 123 - Centro',
    },
  });

  // 2. Admin com email admin@shalom.com e senha "admin"
  await prisma.user.create({
    data: {
      email: 'admin@shalom.com',
      password: hashedPassword,
      name: 'Pastor Administrador',
      role: Role.ADMIN,
      churchId: church.id,
    },
  });

  // 3. Células
  const cells = await Promise.all([
    prisma.cell.create({ data: { name: 'Betel', leader: 'Maria Santos', churchId: church.id } }),
    prisma.cell.create({ data: { name: 'Sião', leader: 'João Silva', churchId: church.id } }),
    prisma.cell.create({ data: { name: 'Jerusalém', leader: 'Ana Oliveira', churchId: church.id } }),
  ]);

  // 4. Membros
  await prisma.member.createMany({
    data: [
      { name: 'João Silva', email: 'joao@email.com', phone: '(11) 99001-0001', churchId: church.id, cellId: cells[1].id },
      { name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 99001-0002', churchId: church.id, cellId: cells[0].id },
      { name: 'Pedro Costa', email: 'pedro@email.com', phone: '(11) 99001-0003', churchId: church.id, cellId: cells[1].id },
      { name: 'Ana Oliveira', email: 'ana@email.com', churchId: church.id, cellId: cells[2].id },
      { name: 'Carlos Mendes', email: 'carlos@email.com', churchId: church.id, cellId: cells[0].id },
    ],
  });

  // 5. Eventos
  await prisma.event.createMany({
    data: [
      { title: 'Culto de Domingo', description: 'Culto Matutino', date: new Date('2026-05-18T09:00:00'), location: 'Templo Sede', churchId: church.id },
      { title: 'Reunião de Células', description: 'Encontro semanal', date: new Date('2026-05-21T19:30:00'), location: 'Casas dos Líderes', churchId: church.id },
      { title: 'Culto de Jovens', description: 'Louvor e Palavra', date: new Date('2026-05-23T19:00:00'), location: 'Salão Principal', churchId: church.id },
    ],
  });

  // 6. Finanças — dados reais para os gráficos
  const now = new Date();
  const financeData = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 15);
    financeData.push(
      { type: 'TITHES' as const, amount: 3200 + Math.random() * 1000, description: 'Dízimos do mês', date: month, churchId: church.id },
      { type: 'OFFERING' as const, amount: 1800 + Math.random() * 600, description: 'Ofertas do mês', date: month, churchId: church.id },
      { type: 'EXPENSE' as const, amount: 900 + Math.random() * 400, description: 'Despesas operacionais', date: month, churchId: church.id },
    );
  }
  await prisma.finance.createMany({ data: financeData });

  console.log('✅ Seed concluído!');
  console.log('🔑 Login: admin@shalom.com / admin');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
