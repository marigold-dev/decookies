import styled from "styled-components";
import cookie from '../../resources/images/cookie.png';

const HeaderContainer = styled.div `
display: flex;
background: #1C1D22;
align-items: center;
justify-content: left;
top: 0;
left: 0;
width: 100%;
position: absolute;
border-bottom: 3px solid #7B7B7E;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
font-family: "Roboto";
font-weight: 500;
margin: 0.8em 0;

p {
    color: #FFFFFF;
    font-size:18px;
}

a {
    text-decoration: none;
    display:flex;
    flex-direction:row;
    justify-content:center;
}

img {
    padding: 1.5vh 1.5vh 3vh 5vh;
    height: 3.2vh;
}  
`;

const Header = () => {
    return (
        <HeaderContainer>
            <a href="/"><img src={cookie} alt="decookies" /><p>Decookies</p></a>
        </HeaderContainer>
    )
};

export default Header
