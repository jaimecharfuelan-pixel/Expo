import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Especialidad } from '../piedrazul/modelos';
import { PiedrazulStore } from '../piedrazul/piedrazul.store';
import { ActualizarEspecialidadDto } from './dto/actualizar-especialidad.dto';
import { CrearEspecialidadDto } from './dto/crear-especialidad.dto';

@Injectable()
export class EspecialidadesService {
  constructor(private readonly store: PiedrazulStore) {}

  listar(): Especialidad[] {
    return this.store.listarEspecialidades();
  }

  obtener(id: number): Especialidad {
    const especialidad = this.store.buscarEspecialidad(id);
    if (!especialidad) {
      throw new NotFoundException(`Especialidad ${id} no encontrada`);
    }
    return especialidad;
  }

  crear(dto: CrearEspecialidadDto): Especialidad {
    this.asegurarNombreLibre(dto.nombre);
    return this.store.guardarEspecialidad({
      nombre: dto.nombre,
      activa: dto.activa ?? true,
    });
  }

  actualizar(id: number, dto: ActualizarEspecialidadDto): Especialidad {
    const actual = this.obtener(id);
    if (dto.nombre === undefined && dto.activa === undefined) {
      throw new BadRequestException('No hay campos para actualizar');
    }
    if (
      dto.nombre !== undefined &&
      normalizar(dto.nombre) !== normalizar(actual.nombre)
    ) {
      this.asegurarNombreLibre(dto.nombre);
    }
    return this.store.guardarEspecialidad({
      id,
      nombre: dto.nombre ?? actual.nombre,
      activa: dto.activa ?? actual.activa,
    });
  }

  eliminar(id: number): Especialidad {
    this.obtener(id);
    if (this.store.contarMedicosDeEspecialidad(id) > 0) {
      throw new ConflictException(
        'No se puede eliminar la especialidad porque tiene médicos asignados',
      );
    }
    const eliminada = this.store.eliminarEspecialidad(id);
    if (!eliminada) {
      throw new NotFoundException(`Especialidad ${id} no encontrada`);
    }
    return eliminada;
  }

  private asegurarNombreLibre(nombre: string): void {
    if (this.store.buscarEspecialidadPorNombre(nombre)) {
      throw new ConflictException('Ya existe una especialidad con ese nombre');
    }
  }
}

function normalizar(valor: string): string {
  return valor.trim().toLocaleLowerCase('es');
}
