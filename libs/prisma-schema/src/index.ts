import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type PlayerPerfs = {
  key: string;
  values: string;
};
export type Screen = {
  id: string;
  storeId: string;
  name: string;
  width: number;
  height: number;
};
export type Store = {
  id: Generated<string>;
  name: string;
  address: string;
  country: string;
};
export type DB = {
  PlayerPerfs: PlayerPerfs;
  Screen: Screen;
  Store: Store;
};
