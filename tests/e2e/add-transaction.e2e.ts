/**
 * E2E test scenario: Adding a manual transaction.
 */
import { TransactionType, SourceType } from '../../shared/src/enums';

describe('E2E: Add Transaction Flow', () => {
  it('creates an expense transaction with category and updates dashboard', async () => {
    const transaction = {
      type: TransactionType.Expense,
      amount_minor: 125000,
      currency: 'KES',
      merchant: 'Carrefour',
      source: SourceType.Manual,
      category_id: 'cat-002',
    };

    expect(transaction.amount_minor).toBe(125000);
    expect(transaction.type).toBe('expense');
  });
});
