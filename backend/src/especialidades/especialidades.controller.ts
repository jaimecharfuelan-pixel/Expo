import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ActualizarEspecialidadDto } from './dto/actualizar-especialidad.dto';
import { CrearEspecialidadDto } from './dto/crear-especialidad.dto';
import { EspecialidadesService } from './especialidades.service';

@Controller('especialidades')
export class EspecialidadesController {
  constructor(
    private readonly especialidadesService: EspecialidadesService,
  ) {}

  @Get()
  listar() {
    return this.especialidadesService.listar();
  }

  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.especialidadesService.obtener(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  crear(@Body() dto: CrearEspecialidadDto) {
    return this.especialidadesService.crear(dto);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarEspecialidadDto,
  ) {
    return this.especialidadesService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.especialidadesService.eliminar(id);
  }
}
