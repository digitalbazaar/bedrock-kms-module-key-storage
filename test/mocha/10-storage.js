/*!
 * Copyright (c) 2019-2026 Digital Bazaar, Inc. All rights reserved.
 */
import * as helpers from './helpers.js';
import {RecordCipher} from '@bedrock/record-cipher';

const {MOCKS} = helpers;

/* eslint-disable */
/*
'u' + Buffer.concat([Buffer.from([0xa2, 0x01]), Buffer.from(crypto.getRandomValues(new Uint8Array(32)))]).toString('base64url')
*/
/* eslint-enable */
const testParameters = [
  {
    title: 'no encryption',
    encryptConfig: {currentKekId: null},
    shouldEncrypt: false
  },
  {
    title: 'aes256 encryption w/json encoding',
    encryptConfig: {
      encoding: 'cbor',
      keks: [{
        id: 'urn:test:aes256',
        secretKeyMultibase: 'uogH3ERq9FRYOV8IuUiD2gKZs_qN6SLU-6RtbBUfzqQwGdg'
      }]
    },
    shouldEncrypt: true
  },
  {
    title: 'aes256 encryption w/cbor encoding',
    encryptConfig: {
      encoding: 'json',
      keks: [{
        id: 'urn:test:aes256',
        secretKeyMultibase: 'uogH3ERq9FRYOV8IuUiD2gKZs_qN6SLU-6RtbBUfzqQwGdg'
      }]
    },
    shouldEncrypt: true
  }
];

for(const {title, encryptConfig, shouldEncrypt} of testParameters) {
  describe(title, () => {
    before(async () => {
      await helpers.clearCollection({
        collectionName: MOCKS.storage.collectionName
      });
      MOCKS.storage.recordCipher = await RecordCipher.create(encryptConfig);
    });

    it('stores a key record', async () => {
      const key = await helpers.generateKey();
      const record = await MOCKS.storage.insert({key});
      record.should.include.keys(['key', 'meta']);
      if(shouldEncrypt) {
        record.key.should.include.key('encrypted');
        record.key.should.not.include.key('secret');
      } else {
        record.key.should.not.include.key('encrypted');
        record.key.should.include.key('secret');
      }
    });

    it('gets a count of key records', async () => {
      await helpers.clearCollection({collectionName: 'kms-module-keys'});

      for(let i = 1; i <= 3; ++i) {
        const key = await helpers.generateKey();
        await MOCKS.storage.insert({key});
        const {count} = await MOCKS.storage.getCount({
          keystoreId: MOCKS.keystoreId
        });
        count.should.equal(i);
      }
    });

    it('gets a key record', async () => {
      const key = await helpers.generateKey();
      await MOCKS.storage.insert({key});
      const record = await MOCKS.storage.get({id: key.id});
      record.key.should.not.include.key('encrypted');
      record.key.should.include.key('secret');
    });
  });
}
