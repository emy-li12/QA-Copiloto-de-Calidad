import {
  readSystemPrompt,
  readProjectFile,
  askClaude,
  writeReport,
} from "../core/runner";

async function main() {
  const changeDescription = process.argv[2];

  if (!changeDescription) {
    console.error(
      'Uso: npm run agent:conocimiento -- "<descripcion del cambio>"'
    );
    console.error(
      'Ejemplo: npm run agent:conocimiento -- "se agrego campo dueDate al formulario de tareas"'
    );
    process.exit(1);
  }

  console.log("Agente Conocimiento iniciando...");
  console.log(`  Cambio: ${changeDescription}\n`);

  const systemPrompt = readSystemPrompt("agente6");

  const flows = readProjectFile("docs/domain/flows.md");
  const entities = readProjectFile("docs/domain/entities.md");
  const businessRules = readProjectFile("docs/domain/business-rules.md");
  const locators = readProjectFile("docs/technical/locators.md");
  const environments = readProjectFile("docs/technical/environments.md");

  const userMessage = `Se ha realizado el siguiente cambio en EmyTask:

**Cambio:** ${changeDescription}

Audita la base de conocimiento y determina exactamente que documentos deben actualizarse.

## docs/domain/flows.md (actual)
${flows}

## docs/domain/entities.md (actual)
${entities}

## docs/domain/business-rules.md (actual)
${businessRules}

## docs/technical/locators.md (actual)
${locators}

## docs/technical/environments.md (actual)
${environments}

Para cada documento afectado:
1. Indica que seccion exacta necesita cambiar
2. Proporciona el texto actualizado listo para pegar
3. Indica si otros agentes deben ser notificados (ej: Mantenimiento si cambio un testid)`;

  console.log("Consultando Claude...\n");
  const audit = await askClaude(systemPrompt, userMessage, 10000);

  console.log("=".repeat(60));
  console.log(audit);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  writeReport(`conocimiento-${timestamp}.md`, audit);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

