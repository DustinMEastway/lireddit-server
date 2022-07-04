import { default as DataLoader } from 'dataloader';

import { Updoot } from '../entities';

interface UpdootKeys {
  postId: number;
  userId: number;
}

export const stringifyUpdootKeys = ({
  postId,
  userId
}: UpdootKeys) => (
  `${userId}|${postId}`
);

export function createUpdootDataLoader() {
  return new DataLoader<UpdootKeys, Updoot | null>(
    async (keyList) => {
      const updoots = await Updoot.findByIds(keyList as UpdootKeys[]);
      const updootMap = new Map(updoots.map((u) => [stringifyUpdootKeys(u), u]));

      return keyList.map((k) => updootMap.get(stringifyUpdootKeys(k)) ?? null);
    }
  );
}
