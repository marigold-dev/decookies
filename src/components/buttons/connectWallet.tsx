type Props = {
    onClick: () => void;
};

export const ConnectButton: React.FC<Props> = ({
    onClick
}) => {

    return (
        <div className="buttons">
            <button className="button" onClick={onClick}>
                <span>
                    <i className="fas fa-wallet"></i>&nbsp; Connect with wallet
                </span>
            </button>
        </div>
    );
};