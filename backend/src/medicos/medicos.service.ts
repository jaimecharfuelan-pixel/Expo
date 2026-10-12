import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Medico, MedicoDetalle } from '../piedrazul/modelos';
import { PiedrazulStore } from '../piedrazul/piedrazul.store';
import { ActualizarMedicoDto } from './dto/actualizar-medico.dto';
import { CrearMedicoDto } from './dto/crear-medico.dto';

@Injectable()
export class MedicosService {
  constructor(private readonly store: PiedrazulStore) {}

  listar(especialidadId?: number): MedicoDetalle[] {
    if (
      especialidadId !== undefined &&
      !this.store.buscarEspecialidad(especialidadId)
    ) {
      throw new NotFoundException(`Especialidad ${especialidadId} no encontrada`);
    }
    return this.store.listarMedicos(especialidadId).map((medico) => {
      return this.presentar(medico);
    });
  }

  obtener(id: number): MedicoDetalle {
    return this.presentar(this.buscar(id));
  }

  crear(dto: CrearMedicoDto): MedicoDetalle {
    this.asegurarEspecialidad(dto.especialidadId);
    const medico = this.store.guardarMedico({
      nombreCompleto: dto.nombreCompleto,
      telefono: dto.telefono,
      especialidadId: dto.especialidadId,
      activo: dto.activo ?? true,
    });
    return this.presentar(medico);
  }

  actualizar(id: number, dto: ActualizarMedicoDto): MedicoDetalle {
    const actual = this.buscar(id);
    if (
      dto.nombreCompleto === undefined &&
      dto.telefono === undefined &&
      dto.especialidadId === undefined &&
      dto.activo === undefined
    ) {
      throw new BadRequestException('No hay campos para actualizar');
    }
    const especialidadId = dto.especialidadId ?? actual.especialidadId;
    this.asegurarEspecialidad(especialidadId);
    const medico = this.store.guardarMedico({
      id,
      nombreCompleto: dto.nombreCompleto ?? actual.nombreCompleto,
      telefono: dto.telefono ?? actual.telefono,
      especialidadId,
      activo: dto.activo ?? actual.activo,
    });
    return this.presentar(medico);
  }

  eliminar(id: number): MedicoDetalle {
    const actual = this.buscar(id);
    const detalle = this.presentar(actual);
    this.store.eliminarMedico(id);
    return detalle;
  }

  private buscar(id: number): Medico {
    const medico = this.store.buscarMedico(id);
    if (!medico) {
      throw new NotFoundException(`Médico ${id} no encontrado`);
    }
    return medico;
  }

  private asegurarEspecialidad(especialidadId: number): void {
    if (!this.store.buscarEspecialidad(especialidadId)) {
      throw new NotFoundException(`Especialidad ${especialidadId} no encontrada`);
    }
  }

  private presentar(medico: Medico): MedicoDetalle {
    const especialidad = this.store.buscarEspecialidad(medico.especialidadId);
    if (!especialidad) {
      throw new NotFoundException(
        `Especialidad ${medico.especialidadId} no encontrada`,
      );
    }
    return { ...medico, especialidad };
  }
}
