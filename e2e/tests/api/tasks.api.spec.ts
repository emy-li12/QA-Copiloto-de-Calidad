import { test, expect } from '@playwright/test';
import { API_BASE, registerAndLogin, cleanupTasks } from '../../helpers/api.helper';

const RUN_ID = Date.now();

test.describe('API > Tasks — guard de autenticación', () => {
  test('401 sin token', async ({ request }) => {
    const res = await request.get(`${API_BASE}/tasks`);
    expect(res.status()).toBe(401);
    expect((await res.json()).success).toBe(false);
  });

  test('401 con token inválido', async ({ request }) => {
    const res = await request.get(`${API_BASE}/tasks`, {
      headers: { Authorization: 'Bearer fake.token.here' },
    });
    expect(res.status()).toBe(401);
  });
});

test.describe('API > Tasks — CRUD', () => {
  let token: string;
  let createdTaskId: string;

  test.beforeAll(async ({ request }) => {
    const auth = await registerAndLogin(request, `qa.tasks.${RUN_ID}@test.com`);
    token = auth.token;
  });

  test.afterAll(async ({ request }) => {
    await cleanupTasks(request, token);
  });

  test('POST /tasks → 201 con la tarea creada', async ({ request }) => {
    const res = await request.post(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: 'API QA task', priority: 'high', status: 'pending' },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.title).toBe('API QA task');
    expect(body.data.priority).toBe('high');
    expect(body.data.status).toBe('pending');
    expect(body.data.id).toBeTruthy();

    createdTaskId = body.data.id;
  });

  test('POST /tasks → 400 cuando falta el título', async ({ request }) => {
    const res = await request.post(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { priority: 'low' },
    });

    expect(res.status()).toBe(400);
    expect((await res.json()).error.code).toBe('VALIDATION_ERROR');
  });

  test('GET /tasks → lista paginada del usuario', async ({ request }) => {
    const res = await request.get(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta).toMatchObject({
      page: expect.any(Number),
      limit: expect.any(Number),
      total: expect.any(Number),
      totalPages: expect.any(Number),
    });
  });

  test('GET /tasks?status=pending → solo tareas pending', async ({ request }) => {
    const res = await request.get(`${API_BASE}/tasks?status=pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    const allPending = body.data.every((t: { status: string }) => t.status === 'pending');
    expect(allPending).toBe(true);
  });

  test('GET /tasks/:id → devuelve la tarea por id', async ({ request }) => {
    const res = await request.get(`${API_BASE}/tasks/${createdTaskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.id).toBe(createdTaskId);
    expect(body.data.title).toBe('API QA task');
  });

  test('PATCH /tasks/:id → actualiza la tarea', async ({ request }) => {
    const res = await request.patch(`${API_BASE}/tasks/${createdTaskId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: 'Updated via QA API', status: 'in_progress' },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.title).toBe('Updated via QA API');
    expect(body.data.status).toBe('in_progress');
  });

  test('DELETE /tasks/:id → elimina la tarea', async ({ request }) => {
    const res = await request.delete(`${API_BASE}/tasks/${createdTaskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(200);
    expect((await res.json()).success).toBe(true);
  });

  test('GET /tasks/:id → 404 después de eliminar', async ({ request }) => {
    const res = await request.get(`${API_BASE}/tasks/${createdTaskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).toBe(404);
  });
});

test.describe('API > Tasks — aislamiento entre usuarios', () => {
  let tokenA: string;
  let tokenB: string;
  let taskIdA: string;

  test.beforeAll(async ({ request }) => {
    const authA = await registerAndLogin(request, `qa.owner.a.${RUN_ID}@test.com`);
    const authB = await registerAndLogin(request, `qa.owner.b.${RUN_ID}@test.com`);
    tokenA = authA.token;
    tokenB = authB.token;

    const res = await request.post(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${tokenA}` },
      data: { title: 'Tarea privada usuario A' },
    });
    taskIdA = (await res.json()).data.id;
  });

  test.afterAll(async ({ request }) => {
    await cleanupTasks(request, tokenA);
    await cleanupTasks(request, tokenB);
  });

  test('usuario B no puede leer la tarea de usuario A', async ({ request }) => {
    const res = await request.get(`${API_BASE}/tasks/${taskIdA}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    expect(res.status()).toBe(404);
  });

  test('usuario B no puede actualizar la tarea de usuario A', async ({ request }) => {
    const res = await request.patch(`${API_BASE}/tasks/${taskIdA}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
      data: { title: 'Hacked!' },
    });
    expect(res.status()).toBe(404);
  });

  test('usuario B no puede eliminar la tarea de usuario A', async ({ request }) => {
    const res = await request.delete(`${API_BASE}/tasks/${taskIdA}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    expect(res.status()).toBe(404);
  });

  test('lista de usuario B no incluye las tareas de usuario A', async ({ request }) => {
    const res = await request.get(`${API_BASE}/tasks`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const body = await res.json();
    const hasTaskA = body.data.some((t: { id: string }) => t.id === taskIdA);
    expect(hasTaskA).toBe(false);
  });
});
