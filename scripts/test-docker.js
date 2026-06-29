const { execSync } = require('child_process');

// Ruta del proyecto con separadores Unix (Docker la entiende en Windows también)
const cwd = process.cwd().replace(/\\/g, '/');
const suite = process.argv[2] || '';
const testPath = suite ? `e2e/tests/${suite}/` : '';

console.log('Construyendo imagen Docker...');
execSync('docker build -t qa-playwright .', { stdio: 'inherit' });

console.log(`\nEjecutando tests${suite ? ` [${suite}]` : ' (todas las suites)'}...\n`);
execSync(
  `docker run --rm ` +
  `-e CI=true ` +
  `-v "${cwd}/reports:/app/reports" ` +
  `-v "${cwd}/test-results:/app/test-results" ` +
  `qa-playwright npx playwright test ${testPath}`,
  { stdio: 'inherit' }
);
