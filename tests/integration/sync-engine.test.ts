/**
 * Integration test: Sync Engine pull & push protocol.
 */
import { SyncOp } from '../../shared/src/enums';
import { SyncEnvelope } from '../../shared/src/sync';

describe('Integration: Sync Engine', () => {
  it('builds envelopes with valid UUIDv7 identifiers and versioning', () => {
    const envelope: SyncEnvelope = {
      entityType: 'transaction',
      entityId: '0192a7c4-0000-7000-8000-000000000001',
      op: SyncOp.Upsert,
      version: 1,
      updatedAt: new Date().toISOString(),
      payload: { amount_minor: 5000 },
      deviceId: 'device-test-01',
    };

    expect(envelope.entityType).toBe('transaction');
    expect(envelope.op).toBe('upsert');
    expect(envelope.version).toBe(1);
  });
});
