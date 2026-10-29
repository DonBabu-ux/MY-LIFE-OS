import m001 from './001_init';
import m002 from './002_finance';
import m003 from './003_receipts';
import m004 from './004_shopping';
import m005 from './005_notes_diary';
import m006 from './006_planner';
import m007 from './007_usage_activity';
import m008 from './008_contacts';
import m009 from './009_sync';

export const migrations = [
  { id: 1, sql: m001 },
  { id: 2, sql: m002 },
  { id: 3, sql: m003 },
  { id: 4, sql: m004 },
  { id: 5, sql: m005 },
  { id: 6, sql: m006 },
  { id: 7, sql: m007 },
  { id: 8, sql: m008 },
  { id: 9, sql: m009 },
];
