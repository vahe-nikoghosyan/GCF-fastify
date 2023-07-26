import { DatabaseEntity } from "./util-types";

export interface SpinSymbol extends DatabaseEntity {
  name: string;
}

export type CreateSpinSymbolRequest = Omit<SpinSymbol, keyof DatabaseEntity>;
