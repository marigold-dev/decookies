import cursor from "../../resources/images/cursor.png";
import grandma from "../../resources/images/grandma.png";
import farm from "../../resources/images/farm.png";
import mine from "../../resources/images/mine.png";
import factory from "../../resources/images/factory.png";
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
} from "../store/cookieBaker";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { NetworkType, PermissionScope, SigningType } from "@airgap/beacon-sdk";

import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as human from "human-crypto-keys";

import { getKeyPair, stringToHex } from "../store/utils";
import { leaderBoard } from "../store/vmTypes";
import Button from "../components/buttons/button";
import HeaderButton from "../components/game/headerButton";
import GameContainer from "../components/game/container";
import Item from "../components/game/item";
import Line from "../components/game/line";
import GameButton from "../components/game/gameButton";
import Modal from "../components/modal";

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
      initState(
        dispatch,
        latestState.current.nodeUri,
        latestState.current.generatedKeyPair
      );
      const id = setInterval(() => {
        if (latestState.current.wallet && latestState.current.nodeUri) {
          const cb = latestState.current.cookieBaker;
          const production = cb.passiveCPS;
          console.log(production);
          try {
            if (production > 0n) {
              const pending = latestState.current.cookiesInOven + production;
              dispatch(updateOven(pending));
              addCookie(production.toString() + "n", dispatch, latestState);
            }
          } catch (err) {
            const error_msg =
              typeof err === "string" ? err : (err as Error).message;
            dispatch(addError(error_msg));
            throw new Error(error_msg);
          }
        }
      }, 1000);
      return () => {
        clearInterval(id);
      };
    }
    return () => {};
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
    addCookie("1n", dispatch, latestState);
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
  const handleTransferClick = () => {
    amountToTransfer = amountToTransferRef.current?.value || "";
    transferRecipient = transferRecipientRef.current?.value || "";
    if (amountToTransfer && transferRecipient) {
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
      return "https://deku-p-demo-vm" + node + ".deku-v1.marigold.dev";
    }
    return "";
  };

  return (
    <>
      <ToastContainer />
      <HeaderButton>
        <Button className="desktopButton" onClick={handleBeaconConnection}>
          Connect wallet
        </Button>
        <button className="mobileButton">
          <img src={menu} />
        </button>
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
                <p>In jon interview</p>
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
                <p>Drilling</p>
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
                <p>Drilling</p>
                <ToolCounter value={gameState.buildingFactories} />
              </div>
              <div className="background value">
                <ToolCounter value={gameState.cookieBaker.factories} />
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
          <Item>
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
            </div>
          </Item>
          <Item>
            <div>
              <h2>Eat cookies</h2>
              <label className="description">Number of cookies you ate</label>
              <input type="text" name="amountToEat" ref={amountToEatRef} />
              <div className="buttonContainer">
                <Button type="submit" disabled={false} onClick={handleEatClick}>
                  Submit
                </Button>
                <a href="#modal-one">
                  <Button dark>Ranking</Button>
                </a>
                <Modal>
                  <div className="modal" id="modal-one" aria-hidden="true">
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
                                (item: leaderBoard, i: any) => (
                                  <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{item.address}</td>
                                    <td>{item.eatenCookies.toString()}</td>
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
          <Item>
            <div>
              <h2>Tranfer cookies</h2>
              <label className="description">
                Send cookies to another player
              </label>
              <label>Recipient address</label>
              <input type="text" name="amount" ref={amountToTransferRef} />
              <label>Cookies</label>
              <input type="text" name="recipient" ref={transferRecipientRef} />
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
