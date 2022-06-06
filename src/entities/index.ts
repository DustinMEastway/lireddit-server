import { Post } from './post';
import { Updoot } from './updoot';
import { User } from './user';

export * from './post';
export * from './updoot';
export * from './user';

export const entities = [
  Post,
  Updoot,
  User
];
