import styled from "styled-components";
import left from '../../../resources/images/left-bg.png';

const GameContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'Roboto Mono', monospace;
    .right {
        display:none;
    }
    .cookieBtn {
        height: 50vmin;
        pointer-events: none;
        background:#1C1D22;
                }
    @media (min-width: 900px) {
            &.container {
            grid-template-columns: 1fr 1fr 1fr;
            grid-gap: 10px;
        }
        section {
            &.middle {
                color: white;
                text-align: center;
                button {
                    background: #1C1D22;
                    border: none;
                }
                p {
                    text-align:left;
                    font-size: 18px;
                    padding-left: 2.8em;
                }
                .cookieText {
                    color:#858080;
                    text-align:left;
                    margin-top: -10px;
                    padding: 0 0 3em 0;
                    font-size: 14px;
                    padding-left: 3.4em;

                }
                .cookieBtn {
                    height: 37vmin;
                    pointer-events: none;
                    animation: animate 7s linear infinite;
                    background:#1C1D22;
                }
            }
            &.right {
                display:flex;
                flex-direction:column;
            }
            &.left {
                width: 350px;
                margin: -1.3em 0px -5em 4em;
                background-image: url(${left});
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                overflow-x: hidden;
                overflow-y: scroll;
               .container {
                padding: 1em 1em;
               }
            }
        }
    }
    @keyframes animate {
        0% {
            transform: rotate(0deg);
        }
        100% {
        transform: rotate(360deg);
        }
    }
`;
export default GameContainer