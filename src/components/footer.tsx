import styled from "styled-components";
import marigold from '../../resources/images/marigold-logo.png';
import github from '../../resources/images/github-logo.png';

const FooterContainer = styled.div `
    border-top: 3px solid #7B7B7E;
    right: 0;
    width: 100%;
    position: fixed;
    left: 0;
    bottom:0;
    background:${props =>props.theme.palette.primary.main};
    display:flex;
    justify-content:space-between;

a {
    text-decoration: none;
    padding:1em 0;
}

img {
    padding: 1vh 5vh 1vh 5vh;
    height: 2.4vh;
}  
`;

const Footer = () => {
    return (
        <FooterContainer>
             <a href="https://www.marigold.dev/"><img src={marigold} alt="marigold" /></a>
             <a href="https://github.com/marigold-dev/decookies"><img src={github} alt="github" /></a>
        </FooterContainer>
    )
};

export default Footer
