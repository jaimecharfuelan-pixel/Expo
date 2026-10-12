import { Module } from '@nestjs/common';
import { PiedrazulModule } from '../piedrazul/piedrazul.module';
import { MedicosController } from './medicos.controller';
import { MedicosService } from './medicos.service';

@Module({
  imports: [PiedrazulModule],
  controllers: [MedicosController],
  providers: [MedicosService],
})
export class MedicosModule {}
