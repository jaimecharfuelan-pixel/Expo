import { Injectable } from '@nestjs/common';
import { Especialidad, Medico } from './modelos';

interface DatosEspecialidad {
  id?: number;
  nombre: string;
  activa: boolean;
}

interface DatosMedico {
  id?: number;
  nombreCompleto: string;
  telefono: string;
  especialidadId: number;
  activo: boolean;
}

@Injectable()
export class PiedrazulStore {
  private readonly especialidades = new Map<number, Especialidad>();
  private readonly medicos = new Map<number, Medico>();
  private siguienteEspecialidadId = 1;
  private siguienteMedicoId = 1;

  constructor() {
    this.sembrar();
  }

  listarEspecialidades(): Especialidad[] {
    return [...this.especialidades.values()];
  }

  buscarEspecialidad(id: number): Especialidad | undefined {
    return this.especialidades.get(id);
  }

  buscarEspecialidadPorNombre(nombre: string): Especialidad | undefined {
    const clave = normalizar(nombre);
    return this.listarEspecialidades().find(
      (especialidad) => normalizar(especialidad.nombre) === clave,
    );
  }

  guardarEspecialidad(datos: DatosEspecialidad): Especialidad {
    const id = datos.id ?? this.siguienteEspecialidadId++;
    const especialidad: Especialidad = {
      id,
      nombre: datos.nombre,
      activa: datos.activa,
    };
    this.especialidades.set(id, especialidad);
    return especialidad;
  }

  eliminarEspecialidad(id: number): Especialidad | undefined {
    const actual = this.especialidades.get(id);
    if (!actual) {
      return undefined;
    }
    this.especialidades.delete(id);
    return actual;
  }

  listarMedicos(especialidadId?: number): Medico[] {
    const todos = [...this.medicos.values()];
    if (especialidadId === undefined) {
      return todos;
    }
    return todos.filter((medico) => medico.especialidadId === especialidadId);
  }

  buscarMedico(id: number): Medico | undefined {
    return this.medicos.get(id);
  }

  contarMedicosDeEspecialidad(especialidadId: number): number {
    return this.listarMedicos(especialidadId).length;
  }

  guardarMedico(datos: DatosMedico): Medico {
    const id = datos.id ?? this.siguienteMedicoId++;
    const medico: Medico = {
      id,
      nombreCompleto: datos.nombreCompleto,
      telefono: datos.telefono,
      especialidadId: datos.especialidadId,
      activo: datos.activo,
    };
    this.medicos.set(id, medico);
    return medico;
  }

  eliminarMedico(id: number): Medico | undefined {
    const actual = this.medicos.get(id);
    if (!actual) {
      return undefined;
    }
    this.medicos.delete(id);
    return actual;
  }

  private sembrar(): void {
    const medicina = this.guardarEspecialidad({
      nombre: 'Medicina General',
      activa: true,
    });
    const fisioterapia = this.guardarEspecialidad({
      nombre: 'Fisioterapia',
      activa: true,
    });
    this.guardarEspecialidad({
      nombre: 'Odontología',
      activa: true,
    });

    this.guardarMedico({
      nombreCompleto: 'Dra. Ana Pérez',
      telefono: '3001112233',
      especialidadId: medicina.id,
      activo: true,
    });
    this.guardarMedico({
      nombreCompleto: 'Ft. Carlos Muñoz',
      telefono: '3002223344',
      especialidadId: fisioterapia.id,
      activo: true,
    });
  }
}

function normalizar(valor: string): string {
  return valor.trim().toLocaleLowerCase('es');
}
