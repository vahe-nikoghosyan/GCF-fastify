import { DatabaseEntity } from "../@types/util-types";

export const createModel = <T>(model: T): T & DatabaseEntity =>
  ({
    ...{
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: null,
    },
    ...model,
  }) as unknown as T & DatabaseEntity;
