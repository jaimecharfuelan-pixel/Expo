# CRUD PiedraAzul (SolidJS + NestJS)

Administración de **especialidades** y **médicos** del agendamiento de citas de PiedraAzul.
Un médico pertenece a una especialidad. No se puede eliminar una especialidad que todavía tenga médicos.

Los datos viven en memoria y vuelven a la demostración (Medicina General, Fisioterapia, Odontología, Dra. Ana Pérez y Ft. Carlos Muñoz) cada vez que se reinicia la API.

## Arranque

En una terminal:

```bash
cd backend
npm run start:dev
```

En otra:

```bash
cd frontend
npm run dev
```

| Pieza | URL |
|---|---|
| Pantalla | http://localhost:5173 |
| API | http://localhost:3000/api |

## Pruebas del backend

```bash
cd backend
npm test
npm run test:e2e
```
