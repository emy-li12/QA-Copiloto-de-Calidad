import { test, expect } from '@playwright/test';
import { API_BASE } from '../../helpers/api.helper';

const RUN_ID = Date.now();
const EMAIL = `qa.api.auth.${RUN_ID}@test.com`;
const PASSWORD = 'TestPass123!';

test.describe('API > POST /auth/register', () => {
  test('201 con token y datos del usuario al registrar', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/register`, {
      data: { name: 'QA API User', email: EMAIL, password: PASSWORD },
    });

    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.token).toBeTruthy();
    expect(body.data.user.email).toBe(EMAIL);
    expect(body.data.user).not.toHaveProperty('passwordHash');
  });

  test('409 cuando el email ya está registrado', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/register`, {
      data: { name: 'Duplicate', email: EMAIL, password: PASSWORD },
    });

    expect(res.status()).toBe(409);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('EMAIL_ALREADY_EXISTS');
  });

  test('400 cuando el formato del email es inválido', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/register`, {
      data: { name: 'Test', email: 'not-an-email', password: PASSWORD },
    });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  test('400 cuando el password es demasiado corto', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/register`, {
      data: { name: 'Test', email: `short.${RUN_ID}@test.com`, password: '123' },
    });

    expect(res.status()).toBe(400);
    expect((await res.json()).success).toBe(false);
  });

  test('400 cuando falta el nombre', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/register`, {
      data: { email: `noname.${RUN_ID}@test.com`, password: PASSWORD },
    });

    expect(res.status()).toBe(400);
    expect((await res.json()).success).toBe(false);
  });

  test('400 cuando el body está vacío', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/register`, { data: {} });

    expect(res.status()).toBe(400);
    expect((await res.json()).success).toBe(false);
  });
});

test.describe('API > POST /auth/login', () => {
  test('200 con token en credenciales válidas', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/login`, {
      data: { email: EMAIL, password: PASSWORD },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(typeof body.data.token).toBe('string');
    expect(body.data.token).toBeTruthy();
  });

  test('401 cuando el password es incorrecto', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/login`, {
      data: { email: EMAIL, password: 'WrongPassword!' },
    });

    expect(res.status()).toBe(401);
    expect((await res.json()).success).toBe(false);
  });

  test('401 cuando el email no existe', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/login`, {
      data: { email: 'nobody@notexist.com', password: PASSWORD },
    });

    expect(res.status()).toBe(401);
    expect((await res.json()).success).toBe(false);
  });

  test('400 cuando el body está vacío', async ({ request }) => {
    const res = await request.post(`${API_BASE}/auth/login`, { data: {} });

    expect(res.status()).toBe(400);
    expect((await res.json()).success).toBe(false);
  });
});
