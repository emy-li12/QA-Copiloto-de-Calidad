import { ScenarioBuilder, TestScenario } from '../builders/scenario.builder';
import { TaskFactory } from '../task.factory';

export const Scenarios = {
  empty: (tag = 'empty'): Promise<TestScenario> =>
    new ScenarioBuilder().withUser({ tag }).build(),

  dashboard: (tag = 'dashboard'): Promise<TestScenario> =>
    new ScenarioBuilder()
      .withUser({ tag })
      .withTasks(2, () => TaskFactory.minimal())
      .withTask(TaskFactory.inProgress())
      .withTask(TaskFactory.completed())
      .withTask(TaskFactory.overdue())
      .withTask(TaskFactory.dueToday())
      .build(),

  withFilters: (tag = 'filters'): Promise<TestScenario> =>
    new ScenarioBuilder()
      .withUser({ tag })
      .withTasks(2, () => TaskFactory.minimal({ status: 'pending', priority: 'high' }))
      .withTasks(2, () => TaskFactory.inProgress({ priority: 'medium' }))
      .withTasks(2, () => TaskFactory.completed({ priority: 'low' }))
      .build(),

  notifications: (tag = 'notif'): Promise<TestScenario> =>
    new ScenarioBuilder()
      .withUser({ tag })
      .withTask(TaskFactory.overdue())
      .withTask(TaskFactory.dueToday())
      .withTask(TaskFactory.completed())
      .build(),

  tasksCRUD: (tag = 'crud'): Promise<TestScenario> =>
    new ScenarioBuilder()
      .withUser({ tag })
      .withTasks(3, () => TaskFactory.minimal())
      .build(),
};
