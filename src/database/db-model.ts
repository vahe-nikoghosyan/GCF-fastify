import { EntityDates } from "../@types/util-types";

export const createModel = <T>(model: T): T & EntityDates =>
  ({
    ...{
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null,
    },
    ...model,
  }) as unknown as T & EntityDates;
