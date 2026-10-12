import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EspecialidadesModule } from './especialidades/especialidades.module';
import { MedicosModule } from './medicos/medicos.module';

@Module({
  imports: [EspecialidadesModule, MedicosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
