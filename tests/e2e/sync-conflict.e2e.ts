/**
 * E2E test scenario: Sync conflict resolution.
 */
import { EntityConflictPolicies, ConflictStrategy } from '../../shared/src/sync';

describe('E2E: Sync Conflict Resolution', () => {
  it('enforces manual review for monetary entities and last-write-wins for tasks', () => {
    expect(EntityConflictPolicies.transaction).toBe(ConflictStrategy.ManualReview);
    expect(EntityConflictPolicies.receipt).toBe(ConflictStrategy.ManualReview);
    expect(EntityConflictPolicies.note).toBe(ConflictStrategy.KeepBoth);
    expect(EntityConflictPolicies.task).toBe(ConflictStrategy.LastWriteWins);
  });
});
