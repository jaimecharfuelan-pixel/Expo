import {
  BadRequestException,
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
  Query,
} from '@nestjs/common';
import { ActualizarMedicoDto } from './dto/actualizar-medico.dto';
import { CrearMedicoDto } from './dto/crear-medico.dto';
import { MedicosService } from './medicos.service';

@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Get()
  listar(@Query('especialidadId') especialidadId?: string) {
    return this.medicosService.listar(this.leerFiltro(especialidadId));
  }

  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number) {
    return this.medicosService.obtener(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  crear(@Body() dto: CrearMedicoDto) {
    return this.medicosService.crear(dto);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarMedicoDto,
  ) {
    return this.medicosService.actualizar(id, dto);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.medicosService.eliminar(id);
  }

  private leerFiltro(especialidadId?: string): number | undefined {
    if (especialidadId === undefined || especialidadId === '') {
      return undefined;
    }
    const id = Number(especialidadId);
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestException('especialidadId debe ser un entero positivo');
    }
    return id;
  }
}
