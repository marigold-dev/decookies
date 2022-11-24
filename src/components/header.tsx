import styled from "styled-components";
import cookie from '../../resources/images/cookie.png';

const HeaderContainer = styled.div `
display: flex;
background: ${props =>props.theme.palette.primary.main};
align-items: center;
justify-content: left;
top: 0;
left: 0;
width: 103%;
position: absolute;
border-bottom: 3px solid #7B7B7E;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
font-family: "Roboto Mono", monospace;
font-weight: 500;
height: 65px;
@media (min-width: 768px) {
    height: 74px;
    width: 160%;
}

@media (min-width: 1400px) {
    width: 100%;
}

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
    padding: 2.2em 1em 2em 5vh;
    height: 1.5em;
}  
`;

const Header = () => {
    return (
        <HeaderContainer>
            <a href="/"><img src={cookie} alt="decookies" /><p>Decookies </p>&nbsp;</a>
        </HeaderContainer>
    )
};

export default Header
