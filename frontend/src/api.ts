import type { DatosEspecialidad, DatosMedico, Especialidad, Medico } from './tipos'

export async function listarEspecialidades(): Promise<Especialidad[]> {
  return solicitar<Especialidad[]>('/api/especialidades')
}

export async function crearEspecialidad(datos: DatosEspecialidad): Promise<Especialidad> {
  return solicitar<Especialidad>('/api/especialidades', {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}

export async function actualizarEspecialidad(
  id: number,
  datos: DatosEspecialidad,
): Promise<Especialidad> {
  return solicitar<Especialidad>(`/api/especialidades/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  })
}

export async function eliminarEspecialidad(id: number): Promise<Especialidad> {
  return solicitar<Especialidad>(`/api/especialidades/${id}`, { method: 'DELETE' })
}

export async function listarMedicos(): Promise<Medico[]> {
  return solicitar<Medico[]>('/api/medicos')
}

export async function crearMedico(datos: DatosMedico): Promise<Medico> {
  return solicitar<Medico>('/api/medicos', {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}

export async function actualizarMedico(id: number, datos: DatosMedico): Promise<Medico> {
  return solicitar<Medico>(`/api/medicos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  })
}

export async function eliminarMedico(id: number): Promise<Medico> {
  return solicitar<Medico>(`/api/medicos/${id}`, { method: 'DELETE' })
}

export function mensajeError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return 'No se pudo completar la operación'
}

async function solicitar<T>(ruta: string, init?: RequestInit): Promise<T> {
  let respuesta: Response
  try {
    respuesta = await fetch(ruta, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
  } catch {
    throw new Error('No se pudo conectar con la API. Comprueba que el backend esté en marcha.')
  }

  if (!respuesta.ok) {
    throw new Error(await leerError(respuesta))
  }

  return (await respuesta.json()) as T
}

async function leerError(respuesta: Response): Promise<string> {
  try {
    const cuerpo = (await respuesta.json()) as { message?: unknown }
    if (Array.isArray(cuerpo.message)) {
      return cuerpo.message.map(String).join(' ')
    }
    if (typeof cuerpo.message === 'string' && cuerpo.message) {
      return cuerpo.message
    }
  } catch {
    return `La API respondió con el estado ${respuesta.status}`
  }
  return `La API respondió con el estado ${respuesta.status}`
}
