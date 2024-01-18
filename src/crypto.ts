// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * Computes a hash for a give string and returns hash as a hex value.
 */
export async function computeHash(data: string, algorithm: 'SHA-512' | 'SHA-256' | 'SHA-1'): Promise<string> {
    const inputBuffer = new TextEncoder().encode(data);
    const hashBuffer = await require('node:crypto').webcrypto.subtle.digest({ name: algorithm }, inputBuffer);

    // Turn into hash string (got this logic from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
