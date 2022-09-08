type Props = {
    onClick: () => void;
};

export const ConnectButton: React.FC<Props> = ({
    onClick
}) => {

    return (
        <div className="buttons">
            <button className="button" onClick={onClick}>
                Connect with wallet
            </button>
        </div>
    );
};
