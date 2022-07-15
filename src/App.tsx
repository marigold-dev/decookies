import React from 'react';
import cookie from './perfectCookie.png';
import './App.css';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import { InMemorySigner } from '@taquito/signer';
import { randomInt } from 'crypto';
import blake2b from 'blake2b';
// const creacteTransaction = (node_uri, public_key, private_key, payload ) => {

// }

interface Values {
  address: string,
  publicKey: string,
  privateKey: string,
  nodeUri: string
}

const signBytes = (privateKey: string, sbytes: string) => {
  const signer = new InMemorySigner(privateKey);
  signer.sign(sbytes);
}

const hashBlake2b = (payload: string): string => {
  const output = new Uint8Array(64);
  const input = Buffer.from(payload);
  return blake2b(output.length).update(input).digest('hex');
}

const handleSubmit = async (
  values: Values,
  { setSubmitting }: FormikHelpers<Values>
) => {

  const OPERATION = "user-operation-gossip"
  const key = values.publicKey;
  const signature = signBytes(values.privateKey, "mabite");
  const nonce = randomInt(1000000);
  try {
    // const block_r = await fetch(values.nodeUri + "/block-level")
    // const block_j = await block_r.json()
    // const block_height: number = block_j.level;
    const block_height = 0;
    const payload = "cookie";
    const data = {
      source: values.address,
      initial_operation: ["Vm_transaction", {
        payload
      }],
      hash: hashBlake2b(payload),
    }
    const operation = {
      hash: hashBlake2b(JSON.stringify(data)),
      key,
      signature,
      nonce,
      block_height
    }

    setTimeout(() => {
      alert(JSON.stringify(operation, null, 2));
      setSubmitting(false);
    }, 500);
  } catch (err) {
    console.error(err);
  }

}

const App = () => (
  <div className="App">
    <Formik
      initialValues={{
        address: '',
        publicKey: '',
        privateKey: '',
        nodeUri: 'http://localhost:4440/',
      }}
      onSubmit={handleSubmit}
    >

      <Form>
        <label htmlFor="address">Address</label>
        <Field id="address" name="address" />

        <label htmlFor="publicKey">Public Key</label>
        <Field id="publicKey" name="publicKey" />

        <label htmlFor="privateKey">Private Key</label>
        <Field id="privateKey" name="privateKey" />

        <label htmlFor="NodeUri">Node URI</label>
        <Field id="nodeUri" name="nodeUri" />
        <button type="submit">
          <img src={cookie} className="App-logo" alt="logo" /></button>
      </Form>
    </Formik>
  </div>
);


export default App;
