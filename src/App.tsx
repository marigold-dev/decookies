import React from 'react';
import cookie from './perfectCookie.png';
import './App.css';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import { InMemorySigner } from '@taquito/signer';
import { encodeExpr, buf2hex, b58decode } from '@taquito/utils';
// import blake2b from 'blake2b';
interface Values {
  address: string,
  privateKey: string,
  nodeUri: string
}

const signBytes = (signer: InMemorySigner, privateKey: string, sbytes: string) => {
  return signer.sign(sbytes);
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
    const max_int_32 = 2147483647;
    const nonce = Math.floor(Math.random() * max_int_32);
    // const nonce = 0;
    const block_r = await fetch(values.nodeUri + "block-level",
      {
        method: "POST",
        body: JSON.stringify(null)
    });
    const block_j = await block_r.json();
    const block_height: number = block_j.level;
    const payload = "Increment";
    const initial_operation = ["Vm_transaction", {
        payload
    }];
    const json_to_hash = JSON.stringify([values.address, initial_operation]);
    const inner_hash = b58decode(encodeExpr(stringToHex(json_to_hash))).slice(4, -2);
    const data = {
      hash: inner_hash, //⚠ respect the order of fields in the object for serialization
      source: values.address,
      initial_operation: initial_operation,
    }
    const full_payload = JSON.stringify([ //FIXME: useless?
      nonce,
      block_height,
      data
    ]);
    const outer_hash = b58decode(encodeExpr(stringToHex(full_payload))).slice(4, -2);
    const signature = await signBytes(signer, values.privateKey, stringToHex(full_payload)).then((val) => val.prefixSig);
    const operation = {
      hash: outer_hash,
      key,
      signature,
      nonce,
      block_height,
      data
    }
    const packet =
      { user_operation: operation };
    await fetch(values.nodeUri +  "user-operation-gossip",
      {
        method: "POST",
        body: JSON.stringify(packet)
      });
    // ADD POST ACTION BELOW
    setTimeout(() => {
      alert(JSON.stringify(packet, null, 2));
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
