import {
  readSystemPrompt,
  readProjectFile,
  askClaude,
  writeReport,
} from "../core/runner";

async function main() {
  const featureDescription = process.argv[2];
  const targetModule = process.argv[3] ?? "tasks";

  if (!featureDescription) {
    console.error(
      'Uso: npm run agent:generador -- "<descripcion del flujo>" [modulo]'
    );
    console.error(
      'Ejemplo: npm run agent:generador -- "crear tarea con fecha de vencimiento" tasks'
    );
    process.exit(1);
  }

  console.log("Agente Generador iniciando...");
  console.log(`  Flujo: ${featureDescription}`);
  console.log(`  Modulo: ${targetModule}\n`);

  const systemPrompt = readSystemPrompt("agente2-generador");

  const flows = readProjectFile("docs/domain/flows.md");
  const locators = readProjectFile("docs/technical/locators.md");
  const businessRules = readProjectFile("docs/domain/business-rules.md");
  const conventions = readProjectFile("docs/technical/playwright-conventions.md");

  const userMessage = `Genera un test Playwright para el siguiente flujo:

**Flujo a cubrir:** ${featureDescription}
**Modulo destino:** ${targetModule}
**Tipo:** ui (end-to-end)

## Flujos documentados
${flows}

## Locators disponibles (data-testid)
${locators}

## Reglas de negocio
${businessRules}

## Convenciones Playwright del proyecto
${conventions}

Genera el archivo .spec.ts completo listo para ejecutar.
Si el flujo requiere nuevos locators que no estan en la lista, indicaelos claramente.
Si se requiere un Page Object nuevo, incluyelo tambien.`;

  console.log("Consultando Claude...\n");
  const spec = await askClaude(systemPrompt, userMessage, 12000);

  console.log("=".repeat(60));
  console.log(spec);

  const safeName = featureDescription
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 40)
    .replace(/-$/, "");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  writeReport(`generador-${safeName}-${timestamp}.md`, spec);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});


