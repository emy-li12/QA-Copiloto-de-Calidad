# QA Copiloto de Calidad

Plataforma de QA inteligente que combina Playwright, TypeScript y agentes de IA para automatizar, analizar y mejorar continuamente la calidad del producto.

**Sistema bajo prueba:** [EmyTask](https://emy-task-frontend.vercel.app) — aplicación de gestión de tareas.

---

## Estructura

```
QA_Copiloto_de_calidad/
├── docs/                   # Base de conocimiento (Fase 2)
│   ├── domain/             # Reglas de negocio, entidades, flujos
│   ├── technical/          # Convenciones Playwright, locators, ambientes
│   └── agents/             # Instrucciones de cada agente IA
├── e2e/                    # Suite de automatización (Fase 3)
│   ├── pages/              # Page Objects
│   ├── helpers/            # Utilidades compartidas
│   ├── fixtures/           # Fixtures tipados
│   ├── data/               # Factories de datos de prueba
│   └── tests/              # Casos de prueba
│       ├── auth/
│       ├── tasks/
│       ├── notifications/
│       └── api/
├── agents/                 # Agentes IA especializados (Fase 4)
│   ├── core/               # Cliente Claude compartido y utilidades
│   ├── analista/           # Analiza reportes y clasifica fallos
│   ├── generador/          # Genera nuevos tests desde requisitos
│   ├── diagnostico/        # Diagnostica causa raíz de fallos
│   ├── mantenimiento/      # Repara tests y Page Objects rotos
│   ├── cobertura/          # Detecta gaps en la suite actual
│   └── conocimiento/       # Mantiene docs/ sincronizada con la app
└── reports/                # Reportes generados por tests y agentes
```

---

## Fases de implementación

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1 | Repositorio y estructura base | ✅ Completado |
| 2 | Base de conocimiento | ✅ Completado |
| 3 | Plataforma de automatización | ✅ Completado |
| 4 | Agentes IA | ✅ Completado |
| 5 | Gestión de datos de prueba | Pendiente |
| 6 | Pipeline CI/CD | Pendiente |

---

## Comandos

### Tests automatizados (Fase 3)

```bash
npm install
npm test                  # Correr todos los tests
npm run test:ui           # Playwright UI mode
npm run test:auth         # Solo tests de autenticación
npm run test:tasks        # Solo tests de tareas
npm run test:api          # Solo tests de API
npm run test:report       # Ver reporte HTML
```

### Agentes IA (Fase 4)

```bash
# Analiza el último reporte de ejecución y clasifica los fallos
npm run agent:analista

# Genera un nuevo test para un flujo dado
npm run agent:generador -- "crear tarea con fecha de vencimiento" tasks

# Diagnostica la causa raíz de un test fallido
npm run agent:diagnostico -- "login exitoso" "Timeout 5000ms exceeded"

# Repara un test o Page Object desactualizado
npm run agent:mantenimiento -- "e2e/pages/TasksPage.ts"

# Detecta gaps en la cobertura actual
npm run agent:cobertura

# Audita qué documentos actualizar tras un cambio en la app
npm run agent:conocimiento -- "se renombró el testid task-create-btn a task-new-btn"
```

Todos los agentes guardan su reporte en `reports/` con timestamp.

---

## Variables de entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `BASE_URL` | URL del sistema bajo prueba | `https://emy-task-frontend.vercel.app` |
| `API_URL` | URL del backend | `https://emytask-backend.onrender.com` |
| `ANTHROPIC_API_KEY` | API key de Anthropic (requerida para agentes) | — |
