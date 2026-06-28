# Ambientes de prueba — QA Copiloto

## Ambientes disponibles

| Ambiente   | Frontend URL                              | Backend URL                               | Base de datos       |
|------------|-------------------------------------------|-------------------------------------------|---------------------|
| Producción | `https://emy-task-frontend.vercel.app`    | `https://emytask-backend.onrender.com`    | MongoDB Atlas       |
| Local      | `http://localhost:5173`                   | `http://localhost:3001`                   | MongoDB local/Atlas |

---

## Variables de entorno

Definidas en `.env` (basado en `.env.example`):

| Variable   | Descripción                  | Default (producción)                     |
|------------|------------------------------|------------------------------------------|
| `BASE_URL` | URL del frontend bajo prueba | `https://emy-task-frontend.vercel.app`   |
| `API_URL`  | URL del backend              | `https://emytask-backend.onrender.com`   |

Para correr contra local:
```
BASE_URL=http://localhost:5173
API_URL=http://localhost:3001
```

---

## Rutas del sistema bajo prueba

| Ruta            | Descripción              | Protegida |
|-----------------|--------------------------|-----------|
| `/login`        | Inicio de sesión         | No        |
| `/register`     | Registro de usuario      | No        |
| `/dashboard`    | Panel principal          | Sí        |
| `/tasks`        | Gestión de tareas        | Sí        |
| `/notifications`| Centro de notificaciones | Sí        |

Las rutas protegidas redirigen a `/login` si no hay token en `localStorage`.

---

## Endpoints de la API

Base path: `/api/v1`

| Método | Ruta                   | Descripción             | Auth requerida |
|--------|------------------------|-------------------------|----------------|
| GET    | `/health`              | Health check            | No             |
| POST   | `/auth/register`       | Registro                | No             |
| POST   | `/auth/login`          | Login, devuelve JWT     | No             |
| GET    | `/tasks`               | Listar tareas paginadas | Sí             |
| POST   | `/tasks`               | Crear tarea             | Sí             |
| GET    | `/tasks/:id`           | Obtener tarea por id    | Sí             |
| PATCH  | `/tasks/:id`           | Actualizar tarea        | Sí             |
| DELETE | `/tasks/:id`           | Eliminar tarea          | Sí             |

---

## LocalStorage del frontend

| Clave           | Contenido                                          |
|-----------------|----------------------------------------------------|
| `emytask_token` | JWT string                                         |
| `emytask_user`  | JSON: `{ name: string, email: string, id: string }`|

---

## Cómo correr los tests

```bash
# Instalar dependencias (primera vez)
npm install
npx playwright install chromium

# Contra producción (default)
npm test

# Contra local (levantar apps antes)
BASE_URL=http://localhost:5173 API_URL=http://localhost:3001 npm test

# Solo un grupo
npm run test:auth
npm run test:tasks
npm run test:api

# Ver reporte HTML
npm run test:report

# Modo interactivo (UI)
npm run test:ui
```

---

## Notas de estabilidad por ambiente

**Producción (Vercel + Render):**
- El backend en Render puede tener cold start de ~30 seg si está inactivo.
- Aumentar timeout en `registerTestUser()` si falla en CI por cold start.
- Los tests API usan la URL real del backend; verificar que esté levantado.

**Local:**
- Frontend: `npm run dev` en `apps/frontend` (puerto 5173).
- Backend: `npm run dev` en `apps/backend` (puerto 3001).
- MongoDB: debe estar corriendo o configurado en `MONGODB_URI`.
