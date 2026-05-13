import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MembersModule } from './modules/members/members.module';
import { CellsModule } from './modules/cells/cells.module';
import { EventsModule } from './modules/events/events.module';
import { FinancesModule } from './modules/finances/finances.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    MembersModule,
    CellsModule,
    EventsModule,
    FinancesModule,
    DashboardModule,
  ],
})
export class AppModule {}
