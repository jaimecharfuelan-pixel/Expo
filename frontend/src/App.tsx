import { createResource, Show, type Resource } from 'solid-js'
import { listarEspecialidades, listarMedicos, mensajeError } from './api'
import { PanelEspecialidades } from './componentes/PanelEspecialidades'
import { PanelMedicos } from './componentes/PanelMedicos'

function lista<T>(recurso: Resource<T[]>): T[] {
  if (recurso.state === 'ready' || recurso.state === 'refreshing') {
    return recurso()
  }
  return []
}

export default function App() {
  const [especialidades, { refetch: recargarEspecialidades }] =
    createResource(listarEspecialidades)
  const [medicos, { refetch: recargarMedicos }] = createResource(listarMedicos)

  const recargar = () => {
    void recargarEspecialidades()
    void recargarMedicos()
  }

  const errorCarga = () => especialidades.error ?? medicos.error
  const especialidadesActuales = () => lista(especialidades)
  const medicosActuales = () => lista(medicos)

  return (
    <>
      <header class="cabecera">
        <div class="marca">
          <span class="monograma" aria-hidden="true">
            PA
          </span>
          <div>
            <p class="producto">PiedraAzul</p>
            <h1>Especialidades y médicos</h1>
          </div>
        </div>
        <p class="resumen">
          {especialidadesActuales().length} especialidades · {medicosActuales().length} médicos
        </p>
      </header>

      <main>
        <p class="intro">
          Administra el catálogo que usa el agendamiento de citas. Cada médico pertenece a una
          especialidad. Los datos se conservan en memoria mientras la API está en marcha.
        </p>
        <Show when={errorCarga()}>
          <p class="alerta" role="alert">
            {mensajeError(errorCarga())}
          </p>
        </Show>
        <div class="rejilla">
          <PanelEspecialidades
            especialidades={especialidadesActuales()}
            cargando={especialidades.loading}
            onCambio={recargar}
          />
          <PanelMedicos
            especialidades={especialidadesActuales()}
            medicos={medicosActuales()}
            cargando={medicos.loading}
            onCambio={recargar}
          />
        </div>
      </main>
    </>
  )
}
