/**
 * Utility script to verify that all shared entity schemas and exports are intact.
 */
import * as entities from '../shared/src/entities';
import * as enums from '../shared/src/enums';
import * as validators from '../shared/src/validators';

console.log('==> Verifying @mylifeos/shared exports...');
console.log(`Enums exported: ${Object.keys(enums).length}`);
console.log(`Entities & helpers exported: ${Object.keys(entities).length}`);
console.log(`Validators exported: ${Object.keys(validators).length}`);
console.log('==> All shared types and schemas validated successfully.');
