import {
  readSystemPrompt,
  readProjectFile,
  readProjectFileOrNull,
  listSpecFiles,
  askClaude,
  writeReport,
} from "../core/runner";

async function main() {
  console.log("Agente Cobertura iniciando...\n");

  const systemPrompt = readSystemPrompt("agente5-cobertura");

  const specFiles = listSpecFiles("e2e/tests");
  console.log(`  Analizando ${specFiles.length} archivos de tests...`);

  const specContents: string[] = [];
  for (const file of specFiles) {
    const content = readProjectFileOrNull(file);
    if (content) {
      specContents.push(`### ${file}\n\`\`\`typescript\n${content}\n\`\`\``);
    }
  }

  const flows = readProjectFile("docs/domain/flows.md");
  const businessRules = readProjectFile("docs/domain/business-rules.md");
  const entities = readProjectFile("docs/domain/entities.md");

  const userMessage = `Analiza la cobertura actual de la suite de tests y genera el reporte de gaps.

## Tests existentes (${specFiles.length} archivos)

${specContents.join("\n\n")}

## Flujos documentados
${flows}

## Reglas de negocio y casos de borde
${businessRules}

## Entidades del dominio
${entities}

Produce el reporte completo con:
1. Mapa de cobertura por modulo (tabla con cubiertos / total / porcentaje)
2. Gaps identificados priorizados por riesgo (critico / alto / medio)
3. Propuestas concretas para el Agente Generador`;

  console.log("Consultando Claude...\n");
  const report = await askClaude(systemPrompt, userMessage, 10000);

  console.log("=".repeat(60));
  console.log(report);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  writeReport(`cobertura-${timestamp}.md`, report);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});


