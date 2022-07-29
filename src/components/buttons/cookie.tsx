import cookie from '../../../resources/perfectCookie.png';
import "./cookie.css";

interface Props {
    onClick: React.MouseEventHandler<HTMLButtonElement>,
};

export const CookieButton: React.FC<Props> = ({ onClick }) =>
    <button
        onClick={onClick} >
        <img src={cookie} className="CookieBtn" alt="logo" />
    </button>