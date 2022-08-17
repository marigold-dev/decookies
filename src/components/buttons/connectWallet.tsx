import { Dispatch, useEffect } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from '@taquito/taquito';
import { NetworkType } from "@airgap/beacon-sdk";
import { action } from "../../store/actions";


type Props = {
    rpc: string;
    dispatch: Dispatch<action>;
    setWallet: (wallet: BeaconWallet) => action;
    setAddress: (address: string) => action;
    wallet: BeaconWallet | null;
};

export const ConnectButton: React.FC<Props> = ({
    rpc,
    dispatch,
    setAddress,
    setWallet,
    wallet
}) => {


    const connectWallet = async (): Promise<void> => {
        try {
            if (!wallet) return createWallet();
            await wallet.requestPermissions({
                network: {
                    type: NetworkType.CUSTOM,
                    rpcUrl: rpc
                }
            });
            const address = await wallet.getPKH();
            dispatch(setAddress(address));
        } catch (error) {
            console.log(error);
        }
    };

    const createWallet = (): void => {
        new TezosToolkit(rpc);
        // creates a wallet instance if not exists
        const myWallet = wallet ? wallet : new BeaconWallet({
            name: "decookies"
        });
        dispatch(setWallet(myWallet));
    }

    useEffect(() => {
        (() => createWallet())();
    }, []);

    return (
        <div className="buttons">
            <button className="button" onClick={connectWallet}>
                <span>
                    <i className="fas fa-wallet"></i>&nbsp; Connect with wallet
                </span>
            </button>
        </div>
    );
};
