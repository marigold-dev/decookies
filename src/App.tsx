import './App.css';

import { Game } from './pages/game';
import { GameProvider } from './store/provider';
// import { Formik, Field, Form, FormikHelpers } from 'formik';

import { action, addCookies } from './store/actions';
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
