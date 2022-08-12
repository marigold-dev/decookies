import "./tool.css";

interface Props {
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    img: string,
    alt: string | undefined,
    disabled: boolean
};

export const ToolButton: React.FC<Props> = ({ onClick, img, alt, disabled }) =>
    <button type="submit"
        onClick={onClick} disabled={disabled}>
        <img src={img} alt={alt} />
    </button>