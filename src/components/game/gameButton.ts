import styled from "styled-components";

const GameButton = styled.button`
    background: none;
    border: 0;
    color: inherit;
    font: inherit;
    line-height: normal;
    overflow: visible;
    padding: 0;
    div {
        &.gameButtonContainer {
            display:grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            justify-content:center;
            align-items:center;
            padding: 0 1em 0.5em 1em;
            height: 6.5em;
            overflow-y: scroll;
            font-size:12px;
            color: #858080;
            h3 {
                color: white;
            }
            .background {
                justify-content:center;
                display:flex;
                align-items:center;
                background:#2B2A2E;
                margin: 0.3em;
                height:74px;
            }
            .title {
                margin: 0.5em 0 0.7em 0;
                text-align: left;
            }
            img {
                width:30px;
                height:30px;
                padding: 0 1em;
                &.price {
                    width:12px;
                    height:12px;
                    padding-right:1em;
                    margin-left:-1em;
                }
            }
        }
        &.column {
            display:flex;
            flex-direction:column;
            width:90px;
            &.price {
                display:flex;
                flex-direction:row;
                }
            }
        }
@media (min-width: 900px) {

    }
`;

export default GameButton