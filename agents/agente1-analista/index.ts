import {
  readSystemPrompt,
  readProjectFileOrNull,
  askClaude,
  writeReport,
} from "../core/runner";

async function main() {
  console.log("Agente Analista iniciando...\n");

  const systemPrompt = readSystemPrompt("agente1-analista");
  const resultsJson = readProjectFileOrNull("reports/results.json");

  let userMessage: string;

  if (!resultsJson) {
    console.warn(
      "AVISO: No se encontro reports/results.json. Ejecuta los tests primero: npm test"
    );
    console.warn("Generando reporte de ejemplo con datos simulados...\n");

    userMessage = `No hay un archivo reports/results.json disponible todavia.

Genera un reporte de ejemplo que demuestre el formato esperado, usando datos ficticios
de una ejecucion hipotetica de la suite de EmyTask (auth, tasks, notifications, api).
Simula que hay algunos tests fallidos con diferentes categorias para mostrar el analisis
completo. Explica tambien como interpretar el resultado.`;
  } else {
    userMessage = `Analiza el siguiente reporte de ejecucion de Playwright y produce el informe completo:

\`\`\`json
${resultsJson}
\`\`\`

Clasifica cada fallo, identifica patrones y da recomendaciones priorizadas.`;
  }

  console.log("Consultando Claude...\n");
  const report = await askClaude(systemPrompt, userMessage);

  console.log("=".repeat(60));
  console.log(report);

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  writeReport(`analista-${timestamp}.md`, report);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});


