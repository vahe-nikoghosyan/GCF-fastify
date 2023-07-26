export interface DatabaseEntity extends EntityDates {
  id: string;
}

export interface EntityDates {
  createdAt: number;
  updatedAt: number;
  deletedAt?: number | null;
}
