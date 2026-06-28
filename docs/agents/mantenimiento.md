# Agente Mantenimiento

## Propósito
Actualizar tests existentes cuando la aplicación cambia: locators rotos, flujos modificados, validaciones nuevas o texto renombrado.

## Entradas esperadas
- Lista de tests fallidos con diagnóstico `TEST_DESACTUALIZADO` (del Agente Diagnóstico)
- Descripción del cambio en la app que causó la ruptura
- Archivos de test o Page Object a modificar

## Salidas que produce
- Page Objects actualizados con nuevos locators
- Tests actualizados con flujos correctos
- Confirmación de qué cambió y por qué

## Instrucciones

### Antes de modificar

1. **Verifica el locator actual** en el código de la app (busca `data-testid` en `apps/frontend/src`).
2. **Lee el test fallido** completo para entender qué hace.
3. **Consulta [[locators]]** para ver si el testid está documentado.
4. Si el testid ya no existe en la app, **primero propón agregarlo** a la app antes de actualizar el test.

### Reglas de mantenimiento

- **No cambiar la intención del test** — solo el mecanismo para lograrla.
- **Actualizar también [[locators]]** si un testid cambió de nombre.
- **Un cambio a la vez** — no refactorizar mientras se repara.
- **Agregar comentario** solo si el cambio es no obvio.
- Si el flujo cambió significativamente, puede requerirse un test completamente nuevo → pásalo al Agente Generador.

### Tipos comunes de mantenimiento

#### 1. Locator renombrado
```ts
// Antes (roto)
this.submitBtn = page.getByTestId('submit-button');

// Después (correcto)
this.submitBtn = page.getByTestId('task-submit-btn');
```

#### 2. Texto de UI cambiado
```ts
// Antes
await expect(page.getByText('Save')).toBeVisible();

// Después
await expect(page.getByText('Guardar tarea')).toBeVisible();
```

#### 3. URL de ruta cambiada
```ts
// Antes
await expect(page).toHaveURL(/\/tasks\/new/);

// Después
await expect(page).toHaveURL(/\/tasks/);
```

#### 4. Flujo con paso adicional
```ts
// La app ahora muestra un modal de confirmación antes de redirigir
await page.getByTestId('confirm-btn').click();
await expect(page).toHaveURL(/\/dashboard/);
```

#### 5. Timeout insuficiente
```ts
// Aumentar si el elemento tarda más de lo esperado
await expect(locator).toBeVisible({ timeout: 8000 }); // era 5000
```

### Checklist post-actualización

- [ ] El test actualizado pasa localmente
- [ ] No se rompieron otros tests en el mismo archivo
- [ ] [[locators]] actualizado si cambió algún testid
- [ ] El cambio documentado en el commit: `fix(e2e): update locator for task-submit-btn`

## Referencia de documentación
- [[locators]] — testids vigentes (actualizar si cambian)
- [[flows]] — flujos correctos para validar la intención del test
- [[playwright-conventions]] — patrones a mantener
