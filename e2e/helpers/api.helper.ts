import { APIRequestContext } from '@playwright/test';

export const API_BASE = `${process.env.API_URL ?? 'https://emytask-backend.onrender.com'}/api/v1`;

export interface AuthResult {
  token: string;
  userId: string;
  email: string;
}

export async function registerAndLogin(
  request: APIRequestContext,
  email: string,
  password = 'TestPass123!'
): Promise<AuthResult> {
  const res = await request.post(`${API_BASE}/auth/register`, {
    data: { name: 'API Test User', email, password },
  });

  if (res.status() === 409) {
    return login(request, email, password);
  }

  const body = await res.json();
  return {
    token: body.data.token,
    userId: body.data.user.id,
    email: body.data.user.email,
  };
}

export async function login(
  request: APIRequestContext,
  email: string,
  password = 'TestPass123!'
): Promise<AuthResult> {
  const res = await request.post(`${API_BASE}/auth/login`, {
    data: { email, password },
  });
  const body = await res.json();
  return {
    token: body.data.token,
    userId: body.data.user.id,
    email: body.data.user.email,
  };
}

export async function cleanupTasks(request: APIRequestContext, token: string): Promise<void> {
  const res = await request.get(`${API_BASE}/tasks?limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await res.json();
  const tasks: Array<{ id: string }> = body.data ?? [];
  for (const task of tasks) {
    await request.delete(`${API_BASE}/tasks/${task.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
