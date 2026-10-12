import { createSignal, For, Show } from 'solid-js'
import {
  actualizarEspecialidad,
  crearEspecialidad,
  eliminarEspecialidad,
  mensajeError,
} from '../api'
import type { Especialidad } from '../tipos'

export function PanelEspecialidades(props: {
  especialidades: Especialidad[]
  cargando: boolean
  onCambio: () => void
}) {
  const [nombre, setNombre] = createSignal('')
  const [activa, setActiva] = createSignal(true)
  const [editandoId, setEditandoId] = createSignal<number | null>(null)
  const [eliminarId, setEliminarId] = createSignal<number | null>(null)
  const [error, setError] = createSignal('')
  const [aviso, setAviso] = createSignal('')
  const [guardando, setGuardando] = createSignal(false)

  const candidata = () => props.especialidades.find((item) => item.id === eliminarId())

  function limpiar() {
    setNombre('')
    setActiva(true)
    setEditandoId(null)
  }

  function comenzarEdicion(especialidad: Especialidad) {
    setEditandoId(especialidad.id)
    setNombre(especialidad.nombre)
    setActiva(especialidad.activa)
    setEliminarId(null)
    setError('')
    setAviso('')
  }

  async function guardar(evento: SubmitEvent) {
    evento.preventDefault()
    setError('')
    setAviso('')
    setGuardando(true)
    try {
      const datos = { nombre: nombre().trim(), activa: activa() }
      const id = editandoId()
      if (id === null) {
        await crearEspecialidad(datos)
        setAviso('Especialidad creada.')
      } else {
        await actualizarEspecialidad(id, datos)
        setAviso('Especialidad actualizada.')
      }
      limpiar()
      props.onCambio()
    } catch (causa) {
      setError(mensajeError(causa))
    } finally {
      setGuardando(false)
    }
  }

  async function confirmarEliminacion() {
    const id = eliminarId()
    if (id === null) {
      return
    }
    setGuardando(true)
    setError('')
    setAviso('')
    try {
      await eliminarEspecialidad(id)
      if (editandoId() === id) {
        limpiar()
      }
      setEliminarId(null)
      setAviso('Especialidad eliminada.')
      props.onCambio()
    } catch (causa) {
      setEliminarId(null)
      setError(mensajeError(causa))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section class="tarjeta" aria-labelledby="titulo-especialidades">
      <header class="tarjeta-cabecera">
        <h2 id="titulo-especialidades">Especialidades</h2>
        <p>Catálogo clínico al que pertenece cada médico.</p>
      </header>

      <form class="formulario" onSubmit={(evento) => void guardar(evento)}>
        <label>
          Nombre
          <input
            value={nombre()}
            onInput={(evento) => setNombre(evento.currentTarget.value)}
            required
            minLength={2}
            maxLength={80}
            placeholder="Ej. Pediatría"
          />
        </label>
        <label class="check">
          <input
            type="checkbox"
            checked={activa()}
            onChange={(evento) => setActiva(evento.currentTarget.checked)}
          />
          Activa para agendar
        </label>
        <div class="acciones">
          <button class="primario" type="submit" disabled={guardando()}>
            {editandoId() === null ? 'Crear especialidad' : 'Guardar cambios'}
          </button>
          <Show when={editandoId() !== null}>
            <button type="button" onClick={limpiar} disabled={guardando()}>
              Cancelar
            </button>
          </Show>
        </div>
      </form>

      <Show when={error()}>
        <p class="alerta" role="alert">
          {error()}
        </p>
      </Show>
      <Show when={aviso()}>
        <p class="aviso" role="status">
          {aviso()}
        </p>
      </Show>
      <Show when={candidata()}>
        {(especialidad) => (
          <div class="confirma" role="alertdialog" aria-label="Confirmar eliminación">
            <p>
              ¿Eliminar <strong>{especialidad().nombre}</strong>? Si tiene médicos asignados, la
              API rechazará la operación.
            </p>
            <div class="acciones">
              <button
                type="button"
                class="peligro"
                disabled={guardando()}
                onClick={() => void confirmarEliminacion()}
              >
                Eliminar
              </button>
              <button type="button" onClick={() => setEliminarId(null)} disabled={guardando()}>
                Volver
              </button>
            </div>
          </div>
        )}
      </Show>

      <Show
        when={props.especialidades.length > 0}
        fallback={
          <p class="vacio">
            {props.cargando
              ? 'Cargando especialidades…'
              : 'No hay especialidades registradas.'}
          </p>
        }
      >
        <div class="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <For each={props.especialidades}>
                {(especialidad) => (
                  <tr classList={{ editando: editandoId() === especialidad.id }}>
                    <td data-label="Nombre">{especialidad.nombre}</td>
                    <td data-label="Estado">
                      <span classList={{ insignia: true, inactiva: !especialidad.activa }}>
                        {especialidad.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td class="acciones-fila" data-label="Acciones">
                      <button type="button" onClick={() => comenzarEdicion(especialidad)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        class="peligro-texto"
                        onClick={() => {
                          setEliminarId(especialidad.id)
                          setError('')
                          setAviso('')
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </section>
  )
}
