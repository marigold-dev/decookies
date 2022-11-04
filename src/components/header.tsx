import styled from "styled-components";
import cookie from '../../resources/images/cookie.png';

const HeaderContainer = styled.div `
display: flex;
background: ${props =>props.theme.palette.primary.main};
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
height: 76px;

p {
    color:${props =>props.theme.palette.common.white};
    font-size:20px;
}

a {
    text-decoration: none;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
}

img {
    padding: 2.2vh 1.7vh 2.7vh 5vh;
    height: 3.3vh;
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
