import * as path from "path";
import {
  readSystemPrompt,
  readProjectFile,
  readProjectFileOrNull,
  askClaude,
  writeReport,
} from "../core/runner";

async function main() {
  const targetFile = process.argv[2];

  if (!targetFile) {
    console.error(
      'Uso: npm run agent:mantenimiento -- "<ruta del archivo>"'
    );
    console.error(
      'Ejemplo: npm run agent:mantenimiento -- "e2e/pages/TasksPage.ts"'
    );
    process.exit(1);
  }

  console.log("Agente Mantenimiento iniciando...");
  console.log(`  Archivo: ${targetFile}\n`);

  const systemPrompt = readSystemPrompt("agente4-mantenimiento");

  const fileContent = readProjectFileOrNull(targetFile);
  if (!fileContent) {
    console.error(`Archivo no encontrado: ${targetFile}`);
    process.exit(1);
  }

  const locators = readProjectFile("docs/technical/locators.md");
  const flows = readProjectFile("docs/domain/flows.md");
  const conventions = readProjectFile("docs/technical/playwright-conventions.md");

  const userMessage = `Analiza el siguiente archivo de test o Page Object y proporciona las actualizaciones necesarias.

**Archivo:** ${targetFile}

\`\`\`typescript
${fileContent}
\`\`\`

## Locators vigentes en la app (data-testid actuales)
${locators}

## Flujos actuales esperados
${flows}

## Convenciones del proyecto
${conventions}

Identifica que esta desactualizado (locators rotos, flujos cambiados, textos renombrados, URLs modificadas)
y produce el archivo corregido completo con una explicacion de cada cambio.`;

  console.log("Consultando Claude...\n");
  const fix = await askClaude(systemPrompt, userMessage, 12000);

  console.log("=".repeat(60));
  console.log(fix);

  const baseName = path.basename(targetFile, path.extname(targetFile));
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  writeReport(`mantenimiento-${baseName}-${timestamp}.md`, fix);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});


