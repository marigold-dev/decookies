import React from 'react';
import cookie from './perfectCookie.png';
import './App.css';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import { InMemorySigner } from '@taquito/signer';
import { encodeExpr, buf2hex } from '@taquito/utils';
// import blake2b from 'blake2b';
interface Values {
  address: string,
  privateKey: string,
  nodeUri: string
}

const signBytes = (signer: InMemorySigner, privateKey: string, sbytes: string) => {
  signer.sign(sbytes);
}

// const hashBlake2b = (payload: string): string => {
//   const output = new Uint8Array(64);
//   const input = Buffer.from(payload);
//   return blake2b(output.length).update(input).digest('hex');
// }

const stringToHex = (payload: string): string => {
  const input = Buffer.from(payload);
  return buf2hex(input);
}

const handleSubmit = async (
  values: Values,
  { setSubmitting }: FormikHelpers<Values>
) => {

  const signer = new InMemorySigner(values.privateKey);
  // const OPERATION = "user-operation-gossip"

  try {
    const key = await signer.publicKey();
    const nonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    // const block_r = await fetch(values.nodeUri + "/block-level")
    // const block_j = await block_r.json()
    // const block_height: number = block_j.level;
    const block_height = 0; // change to get the real height
    const payload = "cookie";
    const data = {
      source: values.address,
      initial_operation: ["Vm_transaction", {
        payload
      }],
      hash: encodeExpr(stringToHex(payload)).substring(4), //remove expr prefix
    }
    const hash_payload = [
      nonce.toString(),
      block_height.toString(),
      JSON.stringify(data)
    ];
    const hash = encodeExpr(stringToHex(JSON.stringify(hash_payload))).substring(4); //remove expr prefix
    const signature = signBytes(signer, values.privateKey, hash);

    const operation = {
      hash,
      key,
      signature,
      nonce,
      block_height,
      data
    }

    // ADD POST ACTION BELOW
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
        privateKey: '',
        nodeUri: 'http://localhost:4440/',
      }}
      onSubmit={handleSubmit}
    >

      <Form>
        <label htmlFor="address">Address</label>
        <Field id="address" name="address" />


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
