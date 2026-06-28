const RUN_ID = Date.now().toString(36);

export interface UserData {
  name: string;
  email: string;
  password: string;
}

export const UserFactory = {
  qaUser: (tag = 'main'): UserData => ({
    name: `QA User ${tag}`,
    email: `qa.${tag}.${RUN_ID}@emytask.test`,
    password: 'TestPassword123!',
  }),

  withEmail: (email: string): UserData => ({
    name: 'QA Custom User',
    email,
    password: 'TestPassword123!',
  }),
};
