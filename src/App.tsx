import './App.css';

import { Game } from './pages/game';
import { GameProvider } from './store/provider';
// import { Formik, Field, Form, FormikHelpers } from 'formik';
// import { InMemorySigner } from '@taquito/signer';
// import { encodeExpr, buf2hex, b58decode } from '@taquito/utils';
// import { TezosToolkit } from "@taquito/taquito";

// import { BeaconWallet } from '@taquito/beacon-wallet';
// import { NetworkType } from '@airgap/beacon-types';

// const options = { name: 'exampleWallet' };
// const wallet = new BeaconWallet(options);


// const Tezos = new TezosToolkit("https://mainnet-tezos.giganode.io");

// interface Values {
//   address: string,
//   privateKey: string,
//   nodeUri: string
//   cookies: number
//   cursors: number
//   grandmas: number
//   farms: number
//   cursor_cost: number
//   grandma_cost: number
//   farm_cost: number
//   cps: number
//   cursor_cps: number
//   grandma_cps: number
//   farm_cps: number
// }

// enum action_type {
//   increment_cookie = "cookie",
//   increment_cursor = "cursor",
//   increment_grandma = "grandma",
//   increment_farm = "farm"
// }

// const block_level = "block-level";
// const user_operation_gossip = "user-operation-gossip";

// const stringToHex = (payload: string): string => {
//   const input = Buffer.from(payload);
//   return buf2hex(input);
// }

// const request_block_level = async (values: Values) => {
//   const block_request = await fetch(values.nodeUri + block_level,
//     {
//       method: "POST",
//       body: JSON.stringify(null)
//     });
//   const block_response = await block_request.json();
//   return block_response.level;
// }

// const create_nonce = () => {
//   const max_int_32 = 2147483647;
//   const nonce = Math.floor(Math.random() * max_int_32);
//   return nonce;
// }

// const get_actual_state = async (values: Values) => {
//   const state_request = await fetch(values.nodeUri + "vm-state",
//     {
//       method: "POST",
//       body: JSON.stringify(null)
//     });
//   const state_response = await state_request.json();
//   console.log(JSON.stringify(state_response));
//   const value = state_response.state.filter(([address, game_state]) => address === values.address);
//   if (value.length !== 1) {
//     console.error("More than one record for this address: " + values.address);
//     alert("More than one record for this address: " + values.address);
//   } else {
//     const my_value = value[0][1];
//     return my_value;
//   }
// }


// const mint = async (values: Values, actions: FormikHelpers<Values>, action: action_type) => {

//   wallet
//     .requestPermissions({ network: { type: NetworkType.JAKARTANET } })
//     .then((_) => wallet.getPKH())
//     .then((address) => {
//       console.log(`Your address: ${address}`);
//       values.address = address;
//     });

//   Tezos.setWalletProvider(wallet);

//   console.log("Mint cookie");
//   const signer = new InMemorySigner(values.privateKey);

//   try {
//     const key = await signer.publicKey();

//     const block_height: number = await request_block_level(values);
//     const payload = action;
//     const initial_operation = ["Vm_transaction", {
//       payload
//     }];
//     const json_to_hash = JSON.stringify([values.address, initial_operation]);
//     const inner_hash = b58decode(encodeExpr(stringToHex(json_to_hash))).slice(4, -2);
//     const data = {
//       hash: inner_hash, //⚠ respect the order of fields in the object for serialization
//       source: values.address,
//       initial_operation: initial_operation,
//     }

//     let nonce = create_nonce();
//     const full_payload = JSON.stringify([ //FIXME: useless?
//       nonce,
//       block_height,
//       data
//     ]);

//     const outer_hash = b58decode(encodeExpr(stringToHex(full_payload))).slice(4, -2);
//     const signature_taquito = await signer.sign(stringToHex(full_payload)).then((val) => val.prefixSig);
//     const operation = {
//       hash: outer_hash,
//       key,
//       signature_taquito,
//       nonce,
//       block_height,
//       data
//     }
//     const packet =
//       { user_operation: operation };

//     await fetch(values.nodeUri + user_operation_gossip,
//       {
//         method: "POST",
//         body: JSON.stringify(packet)
//       });
//   } catch (err) {
//     console.error(err);
//   } finally {
//     actions.setSubmitting(false);
//   }

// }

// const mint_cookie = async (
//   values: Values,
//   actions: FormikHelpers<Values>
// ) => {
//   actions.setSubmitting(true);

//   try {
//     console.log("Minting cookie!");
//     await mint(values, actions, action_type.increment_cookie);

//     const state = await get_actual_state(values);
//     console.log("Current state: " + JSON.stringify(state));
//     const cookies = state.cookie_baker.number_of_cookie;
//     console.log("new total of cookies: " + cookies);
//     values.cookies = cookies;
//     values.cps = state.cookie_baker.total_cps;
//     // ADD POST ACTION BELOW
//     setTimeout(() => {
//       actions.setSubmitting(false);
//     }, 100);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     actions.setSubmitting(false);

//   }
// }

// const mint_cursor = async (
//   values: Values,
//   actions: FormikHelpers<Values>,
//   passive_mint_activated: boolean,
//   counter_cursor: number,
// ) => {
//   actions.setSubmitting(true);
//   try {
//     await mint(values, actions, action_type.increment_cursor);

//     const state = await get_actual_state(values);
//     const cursors = state.cookie_baker.number_of_cursor
//     console.log(cursors);
//     values.cursors = cursors;
//     values.cursor_cost = state.cookie_baker.cursor_cost;
//     values.cursor_cps = state.cookie_baker.cursor_cps;
//     values.cps = state.cookie_baker.total_cps;
//     const cookies = state.cookie_baker.number_of_cookie
//     console.log("new total of cookies: " + cookies);
//     values.cookies = cookies;
//     // ADD POST ACTION BELOW
//     setTimeout(() => {
//       actions.setSubmitting(false);
//     }, 500);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     if (passive_mint_activated && counter_cursor === 0) {
//       setInterval(() => {
//         for (let i = 0; i <= (values.cursor_cps * 10); i++) {
//           mint(values, actions, action_type.increment_cookie);
//           console.log("Cursor: passive mint");
//         }
//       }, 10000);
//       actions.setSubmitting(false);
//     }
//   }
// }

// const mint_grandma = async (
//   values: Values,
//   actions: FormikHelpers<Values>,
//   passive_mint_activated: boolean,
//   counter_grandma: number,
// ) => {
//   actions.setSubmitting(true);
//   try {
//     await mint(values, actions, action_type.increment_grandma);

//     const state = await get_actual_state(values);
//     values.grandmas = state.cookie_baker.number_of_grandma;
//     values.grandma_cost = state.cookie_baker.grandma_cost;
//     values.grandma_cps = state.cookie_baker.grandma_cps;
//     const cookies = state.cookie_baker.number_of_cookie
//     console.log("new total of cookies: " + cookies);
//     values.cookies = cookies;
//     // ADD POST ACTION BELOW
//     setTimeout(() => {
//       actions.setSubmitting(false);
//     }, 500);
//     return state.cookie_baker.grandma_cost;
//   } catch (err) {
//     console.error(err);
//   } finally {
//     if (passive_mint_activated && counter_grandma === 0) {
//       setInterval(() => {
//         for (let i = 0; i <= values.grandma_cps; i++) {
//           mint(values, actions, action_type.increment_cookie);
//           console.log("Grandma: passive mint");
//         }
//       }, 1000);
//       actions.setSubmitting(false);
//     }
//   }
// }
// const mint_farm = async (
//   values: Values,
//   actions: FormikHelpers<Values>,
//   passive_mint_activated: boolean,
//   counter_farm: number,
// ) => {
//   actions.setSubmitting(true);
//   try {
//     await mint(values, actions, action_type.increment_farm);

//     const state = await get_actual_state(values);
//     values.farms = state.cookie_baker.number_of_farm;
//     values.farm_cost = state.cookie_baker.farm_cost;
//     values.farm_cps = state.cookie_baker.farm_cps;
//     const cookies = state.cookie_baker.number_of_cookie
//     console.log("new total of cookies: " + cookies);
//     values.cookies = cookies;
//     // ADD POST ACTION BELOW
//     setTimeout(() => {
//       actions.setSubmitting(false);
//     }, 500);
//     return state.cookie_baker.farm_cost;
//   } catch (err) {
//     console.error(err);
//   } finally {
//     if (passive_mint_activated && counter_farm === 0) {
//       setInterval(() => {
//         for (let i = 0; i <= values.farm_cps; i++) {
//           mint(values, actions, action_type.increment_cookie);
//           console.log("Grandma: passive mint");
//         }
//       }, 1000);
//       actions.setSubmitting(false);
//     }
//   }
// }


const App = () =>
  <GameProvider>
    <div className="App">
      <Game />
    </div>
  </GameProvider>;

export default App;
