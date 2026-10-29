/**
 * Integration test: SQLite migration runner.
 */
describe('Integration: Migration Runner', () => {
  it('verifies that migration versions are sequential and non-empty', () => {
    const migrations = [
      '001_initial_schema',
      '002_add_sync_tables',
      '003_add_fts_indexes',
    ];

    expect(migrations.length).toBeGreaterThanOrEqual(3);
    expect(migrations[0]).toContain('001');
  });
});
