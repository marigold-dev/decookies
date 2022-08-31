import "./reset.css";

interface Props {
    onClick: React.MouseEventHandler<HTMLButtonElement>,
};

export const ResetButton: React.FC<Props> = ({ onClick }) =>
    <button className="reset"
        onClick={onClick} >
        Reset
    </button>