import cursor from "../../resources/images/cursor.png";
import grandma from "../../resources/images/grandma.png";
import farm from "../../resources/images/farm.png";
import mine from "../../resources/images/mine.png";
import factory from "../../resources/images/factory.png";
import bank from "../../resources/images/bank.png";
import temple from "../../resources/images/temple.png";
import cookie from "../../resources/images/cookie.png";
import menu from "../../resources/images/menu-icon.png";

import { CookieButton } from "../components/buttons/cookie";
import { CookieCounter } from "../components/counters/cookie";
import { ToolCounter } from "../components/counters/tool";

import { useGameDispatch, useGame } from "../store/provider";
import {
  addCookie,
  addFarm,
  addGrandma,
  addCursor,
  addMine,
  saveConfig,
  initState,
  clearError,
  addError,
  clearMessage,
  addFactory,
  saveGeneratedKeyPair,
  eatCookie,
  transferCookie,
  saveWallet,
  updateOven,
  updateCursorBasket,
  updateRecruitingGrandmas,
  updateBuildingFarms,
  updateDrillingMines,
  updateBuildingFactories,
  saveContract,
  updateBuildingBanks,
  updateBuildingTemples,
  addBank,
  addTemple,
} from "../store/actions";
import { useEffect, useRef } from "react";
import { state } from "../store/reducer";
import {
  isButtonEnabled,
  buyCursor,
  buyFarm,
  buyGrandma,
  buyMine,
  buyFactory,
  buyBank,
  buyTemple,
} from "../store/cookieBaker";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { NetworkType, PermissionScope, SigningType } from "@airgap/beacon-sdk";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as human from "human-crypto-keys";

import { getKeyPair, leaderBoard, stringToHex } from "../store/utils";
import Button from "../components/buttons/button";
import HeaderButton from "../components/game/headerButton";
import GameContainer from "../components/game/gameContainer";
import Item from "../components/game/item";
import Line from "../components/game/line";
import GameButton from "../components/game/gameButton";
import Modal from "../components/modal";
import { InMemorySigner } from '@taquito/signer';
import * as deku from '@marigold-dev/deku-toolkit'
import * as dekuc from '@marigold-dev/deku-c-toolkit'
import { DekuSigner } from '@marigold-dev/deku-toolkit/lib/utils/signers';

export let nodeUri: string;
export let nickName: string;
export let amountToTransfer: string;
export let transferRecipient: string;
export let amountToEat: string;

export const Game = () => {
  const dispatch = useGameDispatch();
  const gameState: state = useGame();
  const latestState = useRef(gameState);
  latestState.current = gameState;
  // Refs
  const nodeUriRef = useRef<HTMLInputElement | null>(null);
  const nicknameRef = useRef<HTMLInputElement | null>(null);
  const amountToTransferRef = useRef<HTMLInputElement | null>(null);
  const transferRecipientRef = useRef<HTMLInputElement | null>(null);
  const amountToEatRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (latestState.current.wallet && latestState.current.nodeUri) {
      initState(dispatch, latestState.current.nodeUri, latestState.current.generatedKeyPair, latestState);
      const id = setInterval(() => {
        if (latestState.current.wallet && latestState.current.nodeUri) {
          const cb = latestState.current.cookieBaker;
          const production = cb.passiveCPS;
          try {
            if (BigInt(production) > 0n) {
              const pending = latestState.current.cookiesInOven + BigInt(production);
              dispatch(updateOven(pending));
              addCookie(production.toString(), dispatch, latestState)
            }
          } catch (err) {
            const error_msg = (typeof err === 'string') ? err : (err as Error).message;
            dispatch(addError(error_msg));
            throw new Error(error_msg);
          }
        }
      }, 1000)
      return () => {
        clearInterval(id);
      };
    }
    return () => { };
  }, [dispatch, latestState.current.wallet]);

  useEffect(() => {
    if (latestState.current.error) {
      toast.error(latestState.current.error, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
        onClose: () => dispatch(clearError()),
      });
    }
    if (latestState.current.message) {
      toast.info(latestState.current.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: false,
        onClose: () => dispatch(clearMessage()),
      });
    }
  }, [dispatch, latestState.current.error, latestState.current.message]);

  const handleCookieClick = () => {
    //TODO: here?
    const pending = latestState.current.cookiesInOven + 1n;
    dispatch(updateOven(pending));
    addCookie("1", dispatch, latestState);
  };
  const handleCursorClick = () => {
    //TODO: here?
    const pending = latestState.current.cursorsInBasket + 1n;
    dispatch(updateCursorBasket(pending));
    addCursor(dispatch, latestState);
  };
  const handleGrandmaClick = () => {
    const pending = latestState.current.recruitingGrandmas + 1n;
    dispatch(updateRecruitingGrandmas(pending));
    addGrandma(dispatch, latestState);
  };
  const handleFarmClick = () => {
    const pending = latestState.current.buildingFarms + 1n;
    dispatch(updateBuildingFarms(pending));
    addFarm(dispatch, latestState);
  };
  const handleMineClick = () => {
    const pending = latestState.current.drillingMines + 1n;
    dispatch(updateDrillingMines(pending));
    addMine(dispatch, latestState);
  };
  const handleFactoryClick = () => {
    const pending = latestState.current.buildingFactories + 1n;
    dispatch(updateBuildingFactories(pending));
    addFactory(dispatch, latestState);
  };  
  const handleBankClick = () => {
    const pending = latestState.current.buildingBanks + 1n;
    dispatch(updateBuildingBanks(pending));
    addBank(dispatch, latestState);
  };
  const handleTempleClick = () => {
    const pending = latestState.current.buildingTemples + 1n;
    dispatch(updateBuildingTemples(pending));
    addTemple(dispatch, latestState);
  };
  const handleTransferClick = () => {
    amountToTransfer = amountToTransferRef.current?.value || "";
    transferRecipient = transferRecipientRef.current?.value || "";
    if (amountToTransfer && transferRecipient) {
      console.log("amount: ", amountToTransfer);
      console.log("recipient: ", transferRecipient);
      try {
        transferCookie(
          transferRecipient,
          amountToTransfer,
          dispatch,
          latestState
        );
      } catch (err) {
        const error_msg =
          typeof err === "string" ? err : (err as Error).message;
        dispatch(addError(error_msg));
        throw new Error(error_msg);
      }
    }
  };
  const handleEatClick = () => {
    amountToEat = amountToEatRef.current?.value || "";
    if (amountToEat) {
      try {
        eatCookie(amountToEat, dispatch, latestState);
      } catch (err) {
        const error_msg =
          typeof err === "string" ? err : (err as Error).message;
        dispatch(addError(error_msg));
        throw new Error(error_msg);
      }
    }
  };
  const handleBeaconConnection = async () => {
    nodeUri = nodeUriRef.current?.value || "";
    nickName = nicknameRef.current?.value || "";
    dispatch(updateOven(0n));
    dispatch(updateCursorBasket(0n));
    dispatch(updateRecruitingGrandmas(0n));
    dispatch(updateBuildingFarms(0n));
    dispatch(updateDrillingMines(0n));
    dispatch(updateBuildingFactories(0n));
    dispatch(updateBuildingBanks(0n));
    dispatch(updateBuildingTemples(0n));

    if (nodeUri && nickName) {
      dispatch(saveConfig(nodeUri, nickName));
      const createWallet = (): BeaconWallet => {
        const Tezos = new TezosToolkit("https://mainnet.tezos.marigold.dev/");
        // creates a wallet instance if not exists
        const myWallet = new BeaconWallet({
          name: "decookies",
          preferredNetwork: NetworkType.CUSTOM,
        });

        // regarding the documentation this step is necessary
        Tezos.setWalletProvider(myWallet);
        return myWallet;
      };
      try {
        const wallet = latestState.current.wallet
          ? latestState.current.wallet
          : createWallet();
        await wallet.requestPermissions({
          network: {
            type: NetworkType.CUSTOM,
            rpcUrl: "https://mainnet.tezos.marigold.dev/",
          },
          // Only neede to sign the chosen nickname
          scopes: [PermissionScope.SIGN],
        });

        // sign the chosen nickname
        const seed = await wallet.client
          .requestSignPayload({
            signingType: SigningType.RAW,
            payload: stringToHex(nickName),
          })
          .then((val) => val.signature);

        // get keyPair
        const rawKeyPair = await human.getKeyPairFromSeed(
          seed.toString(),
          "ed25519"
        );
        const keyPair = getKeyPair(rawKeyPair);
        // save them in state to use them at each needed action
        dispatch(saveGeneratedKeyPair(keyPair));
        dispatch(saveWallet(wallet));
        const inMemorySigner = new InMemorySigner(keyPair.privateKey)
        const signer: DekuSigner = deku.fromMemorySigner(inMemorySigner);
        const dekuToolkit =
          new dekuc.DekuCClient(
            {
              dekuRpc: nodeUri,
              ligoRpc: "", //TODO: fixme?
              signer
            }
          );
        const contract = dekuToolkit.contract("DK1HyawZsRswfj3KwCM7rvMhvFkV83KcbszG");
        dispatch(saveContract(contract));
      } catch (err) {
        const error_msg =
          typeof err === "string" ? err : (err as Error).message;
        dispatch(addError(error_msg));
        throw new Error(error_msg);
      }
    } else dispatch(addError("Need to fulfil Nickname and Node URI"));
  };

  const getRandomBetaNode = () => {
    if (!latestState.current.nodeUri) {
      //TODO: should always reach the same URI, load-balancing must be done on infra side!
      const node = Math.floor(Math.random() * 4);
      return "https://deku-canonical-vm" + node + ".deku-v1.marigold.dev";
      // https://deku-canonical-vm\{0,1,2,3\}.deku-v1.marigold.dev/api/v1/chain/level
    }
    return "";
  };

  return (
    <>
      <ToastContainer />
      <HeaderButton>
        <a href="#menu-modal">
          <button className="mobileButton">
            <img src={menu} alt="menu" />
          </button>
        </a>
        <Modal>
          <div className="modal " id="menu-modal">
            <div className="modal-dialog mobile header">
              <div className="modal-header">
                <a href="#" className="btn-close" aria-hidden="true">
                  ×
                </a>
              </div>
              <div className="modal-body">
                <div>
                  <a href="#eat-modal">Eat cookies</a>
                  <a href="#transfer-modal">Transfer cookies</a>
                  <a href="/rules">Rules</a>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <Modal>
          <div className="modal" id="eat-modal" aria-hidden="true">
            <div className="modal-dialog mobile header-option">
              <div>
                <a href="#" className="btn-close" aria-hidden="true">
                  ×
                </a>
              </div>
              <div className="modal-body">
                <div>
                  <Item className="modal-item">
                    <div>
                      <h2>Eat cookies</h2>
                      <label className="description">
                        Number of cookies you want to eat
                      </label>
                      <input
                        type="text"
                        name="amountToEat"
                        ref={amountToEatRef}
                      />
                      <div className="buttonContainer">
                        <Button
                          type="submit"
                          disabled={false}
                          onClick={handleEatClick}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </Item>
                  <h3>Eat cookies Ranking</h3>
                  <div>
                    <table className="table">
                      <tbody>
                        <tr>
                          <th>Rank</th>
                          <th>Address</th>
                          <th>Eaten cookies</th>
                        </tr>
                        {gameState.leaderBoard.map(
                          (item: any, i: any) => (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{item[1].address}</td>
                              <td>{item[1].cookieBaker.eatenCookies.toString()}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        <Modal>
          <div className="modal" id="transfer-modal" aria-hidden="true">
            <div className="modal-dialog mobile header-option">
              <div>
                <a href="#" className="btn-close" aria-hidden="true">
                  ×
                </a>
              </div>
              <div className="modal-body">
                <div>
                  <Item className="modal-item">
                    <div>
                      <h2>Tranfer cookies</h2>
                      <label className="description">
                        Send cookies to your friend
                      </label>
                      <label>Recipient address</label>
                      <input
                        type="text"
                        name="recipient"
                        ref={transferRecipientRef}
                      />
                      <label>Cookies</label>
                      <input
                        type="text"
                        name="amount"
                        ref={amountToTransferRef}
                      />
                      <div className="buttonContainer">
                        <Button disabled={false} onClick={handleTransferClick}>
                          Submit
                        </Button>
                      </div>
                    </div>
                  </Item>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </HeaderButton>
      <GameContainer className="container">
        <section className="left">
          <div className="container">
            <a href="/rules">
              <Button dark> Game rules</Button>
            </a>
          </div>
          <Line />
          <GameButton
            disabled={!isButtonEnabled(gameState, buyCursor)}
            onClick={handleCursorClick}
          >
            <div className="gameButtonContainer">
              <img src={cursor} />
              <div className="column title">
                <h3>Cursor</h3>
                <div>
                  <img className="price" src={cookie} />
                  <ToolCounter value={gameState.cookieBaker.cursorCost} />
                </div>
              </div>
              <div className="column background">
                <p>In delivery</p>
                <ToolCounter value={gameState.cursorsInBasket} />
              </div>
              <div className="background value">
                <ToolCounter value={gameState.cookieBaker.cursors} />
              </div>
            </div>
          </GameButton>
          <Line />
          <GameButton
            disabled={!isButtonEnabled(gameState, buyGrandma)}
            onClick={handleGrandmaClick}
          >
            <div className="gameButtonContainer">
              <img src={grandma} />
              <div className="column title">
                <h3>Grandma</h3>
                <div>
                  <img className="price" src={cookie} />
                  <ToolCounter value={gameState.cookieBaker.grandmaCost} />
                </div>
              </div>
              <div className="column background">
                <p>In job interview</p>
                <ToolCounter value={gameState.recruitingGrandmas} />
              </div>
              <div className="background value">
                <ToolCounter value={gameState.cookieBaker.grandmas} />
              </div>
            </div>
          </GameButton>
          <Line />
          <GameButton
            disabled={!isButtonEnabled(gameState, buyFarm)}
            onClick={handleFarmClick}
          >
            <div className="gameButtonContainer">
              <img src={farm} />
              <div className="column title">
                <h3>Farm</h3>
                <div>
                  <img className="price" src={cookie} />
                  <ToolCounter value={gameState.cookieBaker.farmCost} />
                </div>
              </div>
              <div className="column background">
                <p>Under construction</p>
                <ToolCounter value={gameState.buildingFarms} />
              </div>
              <div className="background value">
                <ToolCounter value={gameState.cookieBaker.farms} />
              </div>
            </div>
          </GameButton>
          <Line />
          <GameButton
            disabled={!isButtonEnabled(gameState, buyMine)}
            onClick={handleMineClick}
          >
            <div className="gameButtonContainer">
              <img src={mine} />
              <div className="column title">
                <h3>Mine</h3>
                <div>
                  <img className="price" src={cookie} />
                  <ToolCounter value={gameState.cookieBaker.mineCost} />
                </div>
              </div>
              <div className="column background">
                <p>Drilling in progress</p>
                <ToolCounter value={gameState.drillingMines} />
              </div>
              <div className="background value">
                <ToolCounter value={gameState.cookieBaker.mines} />
              </div>
            </div>
          </GameButton>
          <Line />
          <GameButton
            disabled={!isButtonEnabled(gameState, buyFactory)}
            onClick={handleFactoryClick}
          >
            <div className="gameButtonContainer">
              <img src={factory} />
              <div className="column title">
                <h3>Factory</h3>
                <div>
                  <img className="price" src={cookie} />
                  <ToolCounter value={gameState.cookieBaker.factoryCost} />
                </div>
              </div>
              <div className="column background">
                <p>Under construction</p>
                <ToolCounter value={gameState.buildingFactories} />
              </div>
              <div className="background value">
                <ToolCounter value={gameState.cookieBaker.factories} />
              </div>
            </div>
          </GameButton>
          <Line />
          <GameButton
            disabled={!isButtonEnabled(gameState, buyBank)}
            onClick={handleBankClick}
          >
            <div className="gameButtonContainer">
              <img src={bank} />
              <div className="column title">
                <h3>Banks</h3>
                <div>
                  <img className="price" src={cookie} />
                  <ToolCounter value={gameState.cookieBaker.bankCost} />
                </div>
              </div>
              <div className="column background">
                <p>Under construction</p>
                <ToolCounter value={gameState.buildingBanks} />
              </div>
              <div className="background value">
                <ToolCounter value={gameState.cookieBaker.banks} />
              </div>
            </div>
          </GameButton>
          <Line />
          <GameButton
            disabled={!isButtonEnabled(gameState, buyTemple)}
            onClick={handleTempleClick}
          >
            <div className="gameButtonContainer">
              <img src={temple} />
              <div className="column title">
                <h3>Temples</h3>
                <div>
                  <img className="price" src={cookie} />
                  <ToolCounter value={gameState.cookieBaker.templeCost} />
                </div>
              </div>
              <div className="column background">
                <p>Creating new divinity</p>
                <ToolCounter value={gameState.buildingTemples} />
              </div>
              <div className="background value">
                <ToolCounter value={gameState.cookieBaker.temples} />
              </div>
            </div>
          </GameButton>
          <Line />
          <Item className="player-info">
            <div>
              <h2>Player info</h2>
              <label
                hidden={!latestState.current.publicAddress}
                className="address"
              >
                <p>Address:</p>
                <p className="description">
                  {latestState.current.publicAddress}
                </p>
              </label>
              <label>Nickname:</label>
              <input type="text" name="nickName" ref={nicknameRef} />
              <label>Deku node URI:</label>
              <input
                type="text"
                name="nodeUri"
                ref={nodeUriRef}
                defaultValue={getRandomBetaNode()}
              />
              <Button onClick={handleBeaconConnection}>Connect wallet </Button>
            </div>
          </Item>
        </section>
        <section className="middle">
          <p>Cookies</p>
          <div className="cookieText">
            <ToolCounter value={gameState.cookiesInOven} />{" "}
            <label htmlFor="cursor_cost"> in oven </label>
            <CookieCounter
              value={gameState.cookieBaker.cookies}
              cps={gameState.cookieBaker.passiveCPS}
            />
          </div>
          <CookieButton
            disabled={gameState.wallet === null}
            onClick={handleCookieClick}
          />
        </section>
        <section className="right">
          <Item className="playerInfo">
            <div>
              <h2>Player info</h2>
              <label
                hidden={!latestState.current.publicAddress}
                className="address"
              >
                <p>Address:</p>
                <p className="description">
                  {latestState.current.publicAddress}
                </p>
              </label>
              <label>Nickname:</label>
              <input type="text" name="nickName" ref={nicknameRef} />
              <label>Deku node URI:</label>
              <input
                type="text"
                name="nodeUri"
                ref={nodeUriRef}
                defaultValue={getRandomBetaNode()}
              />
              <Button onClick={handleBeaconConnection}>Connect wallet</Button>
            </div>
          </Item>
          <Item className="eatCookies">
            <div>
              <h2>Eat cookies</h2>
              <label className="description"> Number of cookies you want to eat</label>
              <input type="text" name="amountToEat" ref={amountToEatRef} />
              <div className="buttonContainer">
                <Button type="submit" disabled={false} onClick={handleEatClick}>
                  Submit
                </Button>
                <a href="#ranking">
                  <Button dark>Ranking</Button>
                </a>
                <Modal>
                  <div className="modal" id="ranking" aria-hidden="true">
                    <div className="modal-dialog">
                      <div className="modal-header">
                        <a href="#" className="btn-close" aria-hidden="true">
                          ×
                        </a>
                      </div>
                      <div className="modal-body">
                        <h3>Eat cookies Ranking</h3>
                        <div>
                          <table>
                            <tbody>
                              <tr>
                                <th>Rank</th>
                                <th>Address</th>
                                <th>Eaten cookies</th>
                              </tr>
                              {gameState.leaderBoard.map(
                                (item: any, i: any) => (
                                  <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{item[1].address}</td>
                                    <td>{item[1].cookieBaker.eatenCookies.toString()}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </Item>
          <Item className="transferCookies">
            <div>
              <h2>Tranfer cookies</h2>
              <label className="description">
                Send cookies to your friend
              </label>
              <label>Recipient address</label>
              <input type="text" name="recipient" ref={transferRecipientRef} />
              <label>Cookies</label>
              <input type="text" name="amount" ref={amountToTransferRef} />
              <div className="buttonContainer">
                <Button disabled={false} onClick={handleTransferClick}>
                  Submit
                </Button>
              </div>
            </div>
          </Item>
        </section>
      </GameContainer>
    </>
  );
};
