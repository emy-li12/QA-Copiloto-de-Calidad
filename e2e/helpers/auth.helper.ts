import { Page } from '@playwright/test';

export const API_URL = process.env.API_URL ?? 'https://emytask-backend.onrender.com';

const API_BASE = `${API_URL}/api/v1`;

export const TEST_USER = {
  name: 'QA Copiloto User',
  email: 'qa.copiloto@emytask.test',
  password: 'TestPassword123',
};

export async function registerTestUser(): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEST_USER),
  });
  if (!res.ok && res.status !== 409) {
    throw new Error(`Failed to register test user: ${res.status}`);
  }
}

export async function loginViaAPI(): Promise<string> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_USER.email, password: TEST_USER.password }),
  });
  const json = (await res.json()) as { data: { token: string } };
  return json.data.token;
}

export async function setAuthInBrowser(page: Page, token: string): Promise<void> {
  await page.addInitScript(
    ({ t, u }) => {
      localStorage.setItem('emytask_token', t);
      localStorage.setItem(
        'emytask_user',
        JSON.stringify({ name: u.name, email: u.email, id: 'test' })
      );
    },
    { t: token, u: { name: TEST_USER.name, email: TEST_USER.email } }
  );
}

export async function cleanupTestTasks(token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks?limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = (await res.json()) as { data: Array<{ id: string }> };
  await Promise.all(
    (json.data ?? []).map((task) =>
      fetch(`${API_BASE}/tasks/${task.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
    )
  );
}

export async function createTaskViaAPI(
  token: string,
  data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
  }
): Promise<string> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const json = (await res.json()) as { data: { id: string } };
  return json.data.id;
}
