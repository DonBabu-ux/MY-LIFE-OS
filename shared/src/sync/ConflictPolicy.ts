export const ConflictStrategy = {
  LastWriteWins: 'last_write_wins',
  KeepBoth: 'keep_both',
  ManualReview: 'manual_review',
} as const;

export type ConflictStrategy = (typeof ConflictStrategy)[keyof typeof ConflictStrategy];

export const EntityConflictPolicies: Record<string, ConflictStrategy> = {
  transaction: ConflictStrategy.ManualReview,
  receipt: ConflictStrategy.ManualReview,
  note: ConflictStrategy.KeepBoth,
  diary: ConflictStrategy.KeepBoth,
  task: ConflictStrategy.LastWriteWins,
  shopping_item: ConflictStrategy.LastWriteWins,
  app_usage: ConflictStrategy.LastWriteWins,
  activity_record: ConflictStrategy.LastWriteWins,
};
