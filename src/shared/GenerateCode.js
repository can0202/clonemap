import {randomBytes, createHash} from 'crypto';

export const generateCode = () => {
  const NUM_OF_BYTES = 22; // Total of 44 characters (1 Bytes = 2 char) (standard states that: 43 chars <= verifier <= 128 chars)
  const HASH_ALG = 'sha256';
  const codeVerifier = randomBytes(NUM_OF_BYTES).toString('hex');
  const hash = createHash(HASH_ALG).update(codeVerifier).digest('base64');
  const codeChallenge = hash
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Clean base64 to make it URL safe
  const code = {
    codeVerifier: codeVerifier,
    codeChallenge: codeChallenge,
  };
  return code;
};
