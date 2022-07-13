import React from 'react';
import cookie from './perfectCookie.png';
import './App.css';
import { Formik, Field, Form, FormikHelpers } from 'formik';


// const creacteTransaction = (node_uri, public_key, private_key, payload ) => {

// }

interface Values {
  publicKey: string,
  privateKey: string,
  nodeUri: string
}


const App = () => (
  <div className="App">
    <Formik
      initialValues={{
        publicKey: '',
        privateKey: '',
        nodeUri: 'http://localhost:4440/',
      }}
      onSubmit={(
        values: Values,
        { setSubmitting }: FormikHelpers<Values>
      ) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 500);
      }}
    >

      <Form>
        <label htmlFor="publicKey">Public Key</label>
        <Field id="publicKey" name="publicKey" />

        <label htmlFor="privateKey">Private Key</label>
        <Field id="privateKey" name="privateKey" />

        <label htmlFor="privateKey">Private Key</label>
        <Field id="privateKey" name="privateKey" />
        <button type="submit">
          <img src={cookie} className="App-logo" alt="logo" /></button>
      </Form>
    </Formik>
  </div>
);


export default App;
