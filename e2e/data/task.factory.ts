export interface TaskData {
  title: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

const uid = () => Date.now().toString(36);

export const TaskFactory = {
  minimal: (overrides?: Partial<TaskData>): TaskData => ({
    title: `Tarea QA ${uid()}`,
    ...overrides,
  }),

  full: (overrides?: Partial<TaskData>): TaskData => ({
    title: `Tarea completa ${uid()}`,
    description: 'Descripción generada por QA Copiloto',
    status: 'pending',
    priority: 'medium',
    ...overrides,
  }),

  inProgress: (overrides?: Partial<TaskData>): TaskData => ({
    title: `En progreso ${uid()}`,
    status: 'in_progress',
    priority: 'high',
    ...overrides,
  }),

  completed: (overrides?: Partial<TaskData>): TaskData => ({
    title: `Completada ${uid()}`,
    status: 'completed',
    priority: 'low',
    ...overrides,
  }),

  overdue: (overrides?: Partial<TaskData>): TaskData => ({
    title: `Vencida ${uid()}`,
    status: 'pending',
    priority: 'high',
    dueDate: '2020-01-01',
    ...overrides,
  }),

  dueToday: (overrides?: Partial<TaskData>): TaskData => {
    const today = new Date().toISOString().split('T')[0];
    return {
      title: `Hoy ${uid()}`,
      status: 'pending',
      priority: 'medium',
      dueDate: today,
      ...overrides,
    };
  },
};
