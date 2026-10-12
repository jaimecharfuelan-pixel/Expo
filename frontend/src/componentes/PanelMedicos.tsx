import { createEffect, createSignal, For, Show } from 'solid-js'
import { actualizarMedico, crearMedico, eliminarMedico, mensajeError } from '../api'
import type { Especialidad, Medico } from '../tipos'

export function PanelMedicos(props: {
  especialidades: Especialidad[]
  medicos: Medico[]
  cargando: boolean
  onCambio: () => void
}) {
  const [nombreCompleto, setNombreCompleto] = createSignal('')
  const [telefono, setTelefono] = createSignal('')
  const [especialidadId, setEspecialidadId] = createSignal('')
  const [activo, setActivo] = createSignal(true)
  const [editandoId, setEditandoId] = createSignal<number | null>(null)
  const [eliminarId, setEliminarId] = createSignal<number | null>(null)
  const [filtro, setFiltro] = createSignal('todas')
  const [error, setError] = createSignal('')
  const [aviso, setAviso] = createSignal('')
  const [guardando, setGuardando] = createSignal(false)

  const candidato = () => props.medicos.find((item) => item.id === eliminarId())
  const visibles = () => {
    const valor = filtro()
    if (valor === 'todas') {
      return props.medicos
    }
    return props.medicos.filter((medico) => String(medico.especialidadId) === valor)
  }

  createEffect(() => {
    if (editandoId() !== null || especialidadId() !== '') {
      return
    }
    const primera = props.especialidades[0]
    if (primera) {
      setEspecialidadId(String(primera.id))
    }
  })

  function limpiar() {
    setNombreCompleto('')
    setTelefono('')
    setEspecialidadId('')
    setActivo(true)
    setEditandoId(null)
  }

  function comenzarEdicion(medico: Medico) {
    setEditandoId(medico.id)
    setNombreCompleto(medico.nombreCompleto)
    setTelefono(medico.telefono)
    setEspecialidadId(String(medico.especialidadId))
    setActivo(medico.activo)
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
      const datos = {
        nombreCompleto: nombreCompleto().trim(),
        telefono: telefono().trim(),
        especialidadId: Number(especialidadId()),
        activo: activo(),
      }
      const id = editandoId()
      if (id === null) {
        await crearMedico(datos)
        setAviso('Médico creado.')
      } else {
        await actualizarMedico(id, datos)
        setAviso('Médico actualizado.')
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
      await eliminarMedico(id)
      if (editandoId() === id) {
        limpiar()
      }
      setEliminarId(null)
      setAviso('Médico eliminado.')
      props.onCambio()
    } catch (causa) {
      setEliminarId(null)
      setError(mensajeError(causa))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section class="tarjeta" aria-labelledby="titulo-medicos">
      <header class="tarjeta-cabecera">
        <h2 id="titulo-medicos">Médicos</h2>
        <p>Profesionales que atienden las citas de PiedraAzul.</p>
      </header>

      <form class="formulario" onSubmit={(evento) => void guardar(evento)}>
        <label>
          Nombre completo
          <input
            value={nombreCompleto()}
            onInput={(evento) => setNombreCompleto(evento.currentTarget.value)}
            required
            minLength={3}
            maxLength={120}
            placeholder="Ej. Dra. Laura Méndez"
          />
        </label>
        <label>
          Teléfono
          <input
            value={telefono()}
            onInput={(evento) => setTelefono(evento.currentTarget.value)}
            required
            inputMode="numeric"
            pattern="\d{7,15}"
            title="Entre 7 y 15 dígitos, sin espacios"
            placeholder="3007778899"
          />
        </label>
        <label>
          Especialidad
          <select
            value={especialidadId()}
            onChange={(evento) => setEspecialidadId(evento.currentTarget.value)}
            required
            disabled={props.especialidades.length === 0}
          >
            <Show when={props.especialidades.length === 0}>
              <option value="">Sin especialidades</option>
            </Show>
            <For each={props.especialidades}>
              {(especialidad) => (
                <option value={especialidad.id}>
                  {especialidad.nombre}
                  {especialidad.activa ? '' : ' (inactiva)'}
                </option>
              )}
            </For>
          </select>
        </label>
        <label class="check">
          <input
            type="checkbox"
            checked={activo()}
            onChange={(evento) => setActivo(evento.currentTarget.checked)}
          />
          Activo en la agenda
        </label>
        <div class="acciones">
          <button
            class="primario"
            type="submit"
            disabled={guardando() || props.especialidades.length === 0}
          >
            {editandoId() === null ? 'Crear médico' : 'Guardar cambios'}
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
      <Show when={candidato()}>
        {(medico) => (
          <div class="confirma" role="alertdialog" aria-label="Confirmar eliminación">
            <p>
              ¿Eliminar a <strong>{medico().nombreCompleto}</strong>?
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

      <label class="filtro">
        Filtrar por especialidad
        <select value={filtro()} onChange={(evento) => setFiltro(evento.currentTarget.value)}>
          <option value="todas">Todas</option>
          <For each={props.especialidades}>
            {(especialidad) => <option value={especialidad.id}>{especialidad.nombre}</option>}
          </For>
        </select>
      </label>

      <Show
        when={visibles().length > 0}
        fallback={
          <p class="vacio">
            {props.cargando ? 'Cargando médicos…' : 'No hay médicos para mostrar.'}
          </p>
        }
      >
        <div class="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Especialidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <For each={visibles()}>
                {(medico) => (
                  <tr classList={{ editando: editandoId() === medico.id }}>
                    <td data-label="Nombre">{medico.nombreCompleto}</td>
                    <td data-label="Teléfono">{medico.telefono}</td>
                    <td data-label="Especialidad">{medico.especialidad.nombre}</td>
                    <td data-label="Estado">
                      <span classList={{ insignia: true, inactiva: !medico.activo }}>
                        {medico.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td class="acciones-fila" data-label="Acciones">
                      <button type="button" onClick={() => comenzarEdicion(medico)}>
                        Editar
                      </button>
                      <button
                        type="button"
                        class="peligro-texto"
                        onClick={() => {
                          setEliminarId(medico.id)
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
