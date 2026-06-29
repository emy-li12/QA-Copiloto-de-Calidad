import {
  readSystemPrompt,
  readProjectFile,
  readProjectFileOrNull,
  askClaude,
  writeReport,
} from "../core/runner";

async function main() {
  const requirementsArg = process.argv[2];

  if (!requirementsArg) {
    console.error(
      'Uso: npm run agent:agente1-analista -- "<historia de usuario o requerimiento>"'
    );
    console.error(
      'Ejemplo: npm run agent:agente1-analista -- "Como usuario quiero crear una tarea con fecha de vencimiento"'
    );
    console.error(
      "Alternativa: crea un archivo requirements.md en la raiz y ejecuta sin argumentos"
    );

    const requirementsFile = readProjectFileOrNull("requirements.md");
    if (!requirementsFile) {
      process.exit(1);
    }

    console.log("Leyendo requirements.md...\n");
    await runAnalysis(requirementsFile);
    return;
  }

  await runAnalysis(requirementsArg);
}

async function runAnalysis(requirements: string) {
  console.log("Agente Analista iniciando...\n");

  const systemPrompt = readSystemPrompt("agente1-analista");

  const flows = readProjectFile("docs/domain/flows.md");
  const businessRules = readProjectFile("docs/domain/business-rules.md");
  const entities = readProjectFile("docs/domain/entities.md");

  const userMessage = `Analiza el siguiente requerimiento o historia de usuario y genera los casos de prueba en lenguaje natural:

## Requerimiento / Historia de usuario
${requirements}

## Flujos documentados de EmyTask
${flows}

## Reglas de negocio
${businessRules}

## Entidades del sistema
${entities}

Genera todos los casos de prueba cubriendo: flujo feliz, flujos alternativos, casos de error, casos de borde y seguridad básica.
Usa el formato CP-{N} con prioridad, módulo, precondiciones, pasos y resultado esperado.
Al final incluye el resumen con totales por módulo y casos críticos a automatizar primero.`;

  console.log("Consultando Claude...\n");
  const report = await askClaude(systemPrompt, userMessage, 12000);

  console.log("=".repeat(60));
  console.log(report);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  writeReport(`analista-${timestamp}.md`, report);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
