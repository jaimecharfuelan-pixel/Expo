import { Module } from '@nestjs/common';
import { PiedrazulModule } from '../piedrazul/piedrazul.module';
import { EspecialidadesController } from './especialidades.controller';
import { EspecialidadesService } from './especialidades.service';

@Module({
  imports: [PiedrazulModule],
  controllers: [EspecialidadesController],
  providers: [EspecialidadesService],
})
export class EspecialidadesModule {}
