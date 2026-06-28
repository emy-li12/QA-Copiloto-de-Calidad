import { Page } from '@playwright/test';
import { UserFactory, UserData } from '../data/user.factory';
import { TaskData } from '../data/task.factory';
import { ScenarioBuilder, TestScenario } from '../data/builders/scenario.builder';

const API_BASE = `${process.env.API_URL ?? 'https://emytask-backend.onrender.com'}/api/v1`;

export const DataHelper = {
  scenario: (): ScenarioBuilder => new ScenarioBuilder(),

  async createUser(tag?: string): Promise<{ user: UserData; token: string }> {
    const user = UserFactory.qaUser(tag);

    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (res.ok || res.status === 409) {
      const login = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password: user.password }),
      });
      const body = (await login.json()) as { data: { token: string } };
      return { user, token: body.data.token };
    }

    throw new Error(`createUser falló: ${res.status}`);
  },

  async createTask(token: string, data: TaskData): Promise<string> {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`DataHelper.createTask falló ${res.status}: ${text}`);
    }
    const body = (await res.json()) as { data: { id: string } };
    return body.data.id;
  },

  async createTasks(token: string, tasks: TaskData[]): Promise<string[]> {
    const ids: string[] = [];
    for (const task of tasks) {
      ids.push(await DataHelper.createTask(token, task));
    }
    return ids;
  },

  async cleanupTasks(token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/tasks?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = (await res.json()) as { data: Array<{ id: string }> };
    await Promise.all(
      (body.data ?? []).map((t) =>
        fetch(`${API_BASE}/tasks/${t.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
      )
    );
  },

  async injectAuth(page: Page, scenario: TestScenario): Promise<void> {
    await page.addInitScript(
      ({ token, user }) => {
        localStorage.setItem('emytask_token', token);
        localStorage.setItem('emytask_user', JSON.stringify(user));
      },
      {
        token: scenario.token,
        user: { name: scenario.user.name, email: scenario.user.email, id: 'test' },
      }
    );
  },
};
