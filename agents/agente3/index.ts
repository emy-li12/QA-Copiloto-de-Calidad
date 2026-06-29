import {
  readSystemPrompt,
  readProjectFile,
  askClaude,
  writeReport,
} from "../core/runner";

async function main() {
  const testName = process.argv[2];
  const errorMessage = process.argv[3];

  if (!testName || !errorMessage) {
    console.error(
      'Uso: npm run agent:diagnostico -- "<nombre del test>" "<mensaje de error>"'
    );
    console.error(
      'Ejemplo: npm run agent:diagnostico -- "login exitoso" "Timeout 5000ms exceeded"'
    );
    process.exit(1);
  }

  console.log("Agente Diagnostico iniciando...");
  console.log(`  Test: ${testName}`);
  console.log(`  Error: ${errorMessage}\n`);

  const systemPrompt = readSystemPrompt("agente3");

  const flows = readProjectFile("docs/domain/flows.md");
  const locators = readProjectFile("docs/technical/locators.md");
  const businessRules = readProjectFile("docs/domain/business-rules.md");
  const environments = readProjectFile("docs/technical/environments.md");

  const userMessage = `Diagnostica el siguiente fallo en la suite de tests de EmyTask:

**Nombre del test:** ${testName}
**Mensaje de error:** ${errorMessage}

## Flujos esperados
${flows}

## Locators vigentes
${locators}

## Reglas de negocio y respuestas de API esperadas
${businessRules}

## Ambientes y configuracion
${environments}

Produce el diagnostico completo indicando el tipo (BUG_EN_APP / TEST_DESACTUALIZADO /
PROBLEMA_AMBIENTE / DATOS_SUCIOS / FLAKY), la causa raiz, la evidencia y la accion recomendada.`;

  console.log("Consultando Claude...\n");
  const diagnosis = await askClaude(systemPrompt, userMessage);

  console.log("=".repeat(60));
  console.log(diagnosis);

  const safeName = testName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 30)
    .replace(/-$/, "");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  writeReport(`diagnostico-${safeName}-${timestamp}.md`, diagnosis);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

