import "./header.css";
import cookie from '../../../resources/perfectCookie.png';

export const Header: React.FC = () =>
    <div className="header">
        <img src={cookie} alt="logo" />
        <a href="/"><p>Decookies</p></a>
    </div>