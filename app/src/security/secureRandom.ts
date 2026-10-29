// Secure random byte generator for cryptographic keys
// Uses Node's crypto module (available in React Native via Metro)
import { randomBytes } from 'crypto';

/**
 * Returns a Uint8Array containing cryptographically secure random bytes.
 * @param length Number of random bytes to generate.
 */
export const getSecureRandomBytes = (length: number): Uint8Array => {
  // randomBytes returns a Buffer; convert to Uint8Array for consistency.
  const buf = randomBytes(length);
  return new Uint8Array(buf);
};
