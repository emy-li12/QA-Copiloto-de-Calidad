import { UserFactory, UserData } from '../user.factory';
import { TaskFactory, TaskData } from '../task.factory';

const API_BASE = `${process.env.API_URL ?? 'https://emytask-backend.onrender.com'}/api/v1`;

async function registerAndGetToken(user: UserData): Promise<string> {
  const register = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  if (register.ok || register.status === 409) {
    const login = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, password: user.password }),
    });
    const body = (await login.json()) as { data: { token: string } };
    return body.data.token;
  }

  throw new Error(`No se pudo registrar el usuario: ${register.status}`);
}

async function createTaskViaFetch(token: string, data: TaskData): Promise<string> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  const body = (await res.json()) as { data: { id: string } };
  return body.data.id;
}

async function cleanupAllTasks(token: string): Promise<void> {
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
}

export class TestScenario {
  readonly user: UserData;
  readonly token: string;
  readonly taskIds: string[];

  constructor(data: { user: UserData; token: string; taskIds: string[] }) {
    this.user = data.user;
    this.token = data.token;
    this.taskIds = data.taskIds;
  }

  async cleanup(): Promise<void> {
    await cleanupAllTasks(this.token);
  }
}

export class ScenarioBuilder {
  private userConfig: UserData | null = null;
  private taskQueue: TaskData[] = [];

  withUser(overrides?: Partial<UserData> & { tag?: string }): this {
    const { tag = 'test', ...rest } = overrides ?? {};
    this.userConfig = { ...UserFactory.qaUser(tag), ...rest };
    return this;
  }

  withTask(data: TaskData): this {
    this.taskQueue.push(data);
    return this;
  }

  withTasks(count: number, factory: () => TaskData): this {
    for (let i = 0; i < count; i++) {
      this.taskQueue.push(factory());
    }
    return this;
  }

  async build(): Promise<TestScenario> {
    const user = this.userConfig ?? UserFactory.qaUser();
    const token = await registerAndGetToken(user);

    const taskIds: string[] = [];
    for (const taskData of this.taskQueue) {
      const id = await createTaskViaFetch(token, taskData);
      taskIds.push(id);
    }

    return new TestScenario({ user, token, taskIds });
  }
}
