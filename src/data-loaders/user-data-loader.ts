import { default as DataLoader } from 'dataloader';

import { User } from '../entities';

export function createUserDataLoader() {
  return new DataLoader<number, User | null>(
    async (userIds) => {
      const users = await User.findByIds(userIds as number[]);
      const userMap = new Map(users.map((u) => [u.id, u]));

      return userIds.map((id) => userMap.get(id) ?? null);
    }
  );
}
