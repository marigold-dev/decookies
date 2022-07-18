import React from 'react';
import ReactDOM from 'react-dom';
import cookie from './perfectCookie.png';
import './App.css';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import { InMemorySigner } from '@taquito/signer';
import { encodeExpr, buf2hex, b58decode } from '@taquito/utils';


interface Values {
  address: string,
  privateKey: string,
  nodeUri: string
  cookies: number
  cursors: number
}

enum action_type {
  increment_cookie = "cookie",
  increment_cursor = "cursor",
  increment_grandma = "grandma",
  increment_farm = "farm"
}

const block_level = "block-level";
const user_operation_gossip = "user-operation-gossip";

const stringToHex = (payload: string): string => {
  const input = Buffer.from(payload);
  return buf2hex(input);
}

const request_block_level = async (values: Values) => {
  const block_request = await fetch(values.nodeUri + block_level,
    {
      method: "POST",
      body: JSON.stringify(null)
    });
  const block_response = await block_request.json();
  return block_response.level;
}

const create_nonce = () => {
  const max_int_32 = 2147483647;
  const nonce = Math.floor(Math.random() * max_int_32);
  return nonce;
}

const get_actual_state = async (values: Values) => {
  const state_request = await fetch(values.nodeUri + "vm-state",
    {
      method: "POST",
      body: JSON.stringify(null)
    });
  const state_response = await state_request.json();
  const value = state_response.state[0][1];
  return value.cookie_baker_state;
}


const handleSubmit = async (
  values: Values,
  actions: FormikHelpers<Values>
) => {
  
  const signer = new InMemorySigner(values.privateKey);

  try {
    const key = await signer.publicKey();

    const block_height: number = await request_block_level(values);
    const payload = action_type.increment_cookie;
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

    let nonce = create_nonce();
    const full_payload = JSON.stringify([ //FIXME: useless?
      nonce,
      block_height,
      data
    ]);

    const outer_hash = b58decode(encodeExpr(stringToHex(full_payload))).slice(4, -2);
    const signature = await signer.sign(stringToHex(full_payload)).then((val) => val.prefixSig);
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
    const result = await fetch(values.nodeUri + user_operation_gossip,
      {
        method: "POST",
        body: JSON.stringify(packet)
      });

    const cookie_baker_state = await get_actual_state(values);
    const cookies = cookie_baker_state.number_of_cookie
    console.log(cookies);
    values.cookies = cookies;
    // ADD POST ACTION BELOW
    setTimeout(() => {
      actions.setSubmitting(false);
    }, 25);
  } catch (err) {
    console.error(err);
  } finally {
    actions.setSubmitting(false);
  }
}

const App = () => {
  return (
    <div className="App">
      <Formik
        initialValues={{
          address: '',
          privateKey: '',
          nodeUri: 'http://localhost:4440/',
          cookies: 0,
          cursors: 0,
        }}
        onSubmit={(values, actions) => {
          handleSubmit(values, actions);
        }}
      >
        <Form>
          <label htmlFor="address">Address</label>
          <Field id="address" name="address" />

          <label htmlFor="privateKey">Private Key</label>
          <Field id="privateKey" name="privateKey" />

          <label htmlFor="NodeUri">Node URI</label>
          <Field id="nodeUri" name="nodeUri" />
          <button type="submit" >
            <img src={cookie} className="App-logo" alt="logo" />
          </button>


          <label htmlFor="Cookies">Cookies:</label>
          <Field id="cookies" name="cookies" />
          <label htmlFor="Cursors">Cursors:</label>
          <Field id="cursors" name="cursors" />

          <button type="submit" name="buy_cursor" >Buy a cursor</button>

          <label htmlFor="Grandmas">Grandmas:</label>
          <Field id="grandmas" name="grandmas" />
          <label htmlFor="Farms">Farms:</label>
          <Field id="farms" name="farms" />
        </Form>
      </Formik>
    </div >)
};

export default App;
