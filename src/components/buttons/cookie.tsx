import cookie from '../../../resources/images/cookie.png';

interface Props {
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    disabled: boolean
};

export const CookieButton: React.FC<Props> = ({ onClick, disabled }) =>
    <button
        onClick={onClick} disabled={disabled}  >
        <img src={cookie} className="cookieBtn" alt="logo" />
    </button>