/*!
 * Copyright (c) 2021-2026 Digital Bazaar, Inc.
 */
import * as database from '@bedrock/mongodb';
import {generateId} from 'bnid';
import {randomBytes} from 'node:crypto';

export const MOCKS = {};

MOCKS.keystoreId = 'https://local.example/keystores/123';

export async function clearCollection({collectionName} = {}) {
  await database.collections[collectionName].deleteMany({});
}

export async function generateKey() {
  const keyId = `${MOCKS.keystoreId}/` +
    await generateId({
      encoding: 'base58', multibase: true, multihash: true, bitLength: 128
    });

  const keyContextUrl = 'https://w3id.org/security/suites/hmac-2019/v1';
  const type = 'Sha256HmacKey2019';

  const key = {
    '@context': keyContextUrl,
    id: keyId,
    type,
    secret: Buffer.from(randomBytes(32)).toString('base64url')
  };

  return key;
}
