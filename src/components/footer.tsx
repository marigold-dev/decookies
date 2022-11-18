import styled from "styled-components";
import marigold from '../../resources/images/marigold-logo.png';
import github from '../../resources/images/github-logo.png';

const FooterContainer = styled.div`
    border-top: 3px solid #7B7B7E;
    right: 0;
    width: 100%;
    position: fixed;
    left: 0;
    bottom:0;
    background:${props => props.theme.palette.primary.main};
    display:flex;
    justify-content:space-between;

    div {
        display:flex;
        padding-right:5vh;
    }

a {
    text-decoration: none;
    padding:1em 0;
}

img {
    padding: 1vh 0 1vh 2vh;
    height:2.9vh;
       &.marigold {
        height:2.3vh;
        padding-left:5vh;
    }
}
`;

const Footer = () => {
    return (
        <FooterContainer>
            <div>
                <a target="_blank" href="https://www.marigold.dev/"><img className="marigold" src={marigold} alt="marigold" /></a>
                <a target="_blank" href="https://www.marigold.dev/deku"><img src='https://uploads-ssl.webflow.com/616ab4741d375d1642c19027/62c58c16377e57478aefc716_Group%20129.svg' alt="deku" /></a>
            </div>
            <div>
                <a target="_blank" href="https://github.com/marigold-dev/decookies"><img src={github} alt="github" /></a>
            </div>
        </FooterContainer>
    )
};

export default Footer
