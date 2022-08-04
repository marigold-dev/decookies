import "./tool.css";

interface Props {
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    img: string,
    alt: string | undefined
};

export const ToolButton: React.FC<Props> = ({ onClick, img, alt }) =>
    <button type="submit"
        onClick={onClick}>
        <img src={img} alt={alt} />
    </button>