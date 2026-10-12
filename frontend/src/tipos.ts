export interface Especialidad {
  id: number
  nombre: string
  activa: boolean
}

export interface Medico {
  id: number
  nombreCompleto: string
  telefono: string
  especialidadId: number
  activo: boolean
  especialidad: Especialidad
}

export interface DatosEspecialidad {
  nombre: string
  activa: boolean
}

export interface DatosMedico {
  nombreCompleto: string
  telefono: string
  especialidadId: number
  activo: boolean
}
