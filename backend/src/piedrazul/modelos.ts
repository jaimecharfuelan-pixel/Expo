export interface Especialidad {
  id: number;
  nombre: string;
  activa: boolean;
}

export interface Medico {
  id: number;
  nombreCompleto: string;
  telefono: string;
  especialidadId: number;
  activo: boolean;
}

export interface MedicoDetalle extends Medico {
  especialidad: Especialidad;
}
