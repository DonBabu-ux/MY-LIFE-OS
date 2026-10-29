/**
 * Development script to generate and seed sample local data.
 */
import { TransactionType, SourceType, CategoryKind } from '../shared/src/enums';

export const sampleCategories = [
  { id: 'cat-1', name: 'Food & Dining', kind: CategoryKind.Expense, icon: 'restaurant', color: '#FF7043', is_system: true, sort_order: 1 },
  { id: 'cat-2', name: 'Groceries', kind: CategoryKind.Expense, icon: 'cart', color: '#4CAF50', is_system: true, sort_order: 2 },
  { id: 'cat-3', name: 'Transport', kind: CategoryKind.Expense, icon: 'car', color: '#29B6F6', is_system: true, sort_order: 3 },
  { id: 'cat-4', name: 'Salary', kind: CategoryKind.Income, icon: 'cash', color: '#66BB6A', is_system: true, sort_order: 4 },
  { id: 'cat-5', name: 'Utilities', kind: CategoryKind.Expense, icon: 'flash', color: '#FFA726', is_system: true, sort_order: 5 },
];

export const sampleTransactions = [
  {
    id: 'tx-001',
    type: TransactionType.Expense,
    amount_minor: 45000, // 450.00 KES
    currency: 'KES',
    occurred_at: new Date().toISOString(),
    merchant: 'Naivas Supermarket',
    description: 'Weekly grocery shopping',
    category_id: 'cat-2',
    source: SourceType.Sms,
    sync_state: 'local_only',
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'tx-002',
    type: TransactionType.Income,
    amount_minor: 12000000, // 120,000.00 KES
    currency: 'KES',
    occurred_at: new Date().toISOString(),
    merchant: 'Acme Corp',
    description: 'Monthly salary',
    category_id: 'cat-4',
    source: SourceType.Manual,
    sync_state: 'local_only',
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

console.log('Sample seed data ready:', {
  categoriesCount: sampleCategories.length,
  transactionsCount: sampleTransactions.length,
});
