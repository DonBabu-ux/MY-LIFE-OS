/**
 * Sequential bootstrap. Each step is idempotent.
 * Real implementations land in the DB / security / sync batches.
 * For now: everything is a no-op so the app can boot.
 */

export type BootstrapResult = {
  ok: boolean;
  errors: string[];
};

export const bootstrap = async (): Promise<BootstrapResult> => {
  const errors: string[] = [];
  return { ok: errors.length === 0, errors };
};
