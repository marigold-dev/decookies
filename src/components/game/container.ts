import styled from "styled-components";

const GameContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: "Roboto Mono", monospace;
  .right {
    display: none;
  }
  .left {
    display: block;
    width: 207px;
    margin: 0em 1px 25em 0em;
    border-right: 3px solid #7B7B7E;
    border-left: 3px solid #7B7B7E;
    .container {
        display:none;
        padding: 1em 1em;
    }
  }
  .middle {
    color: white;
    text-align: center;
    button {
      background: #1c1d22;
      border: none;
    }
    p {
      text-align: left;
      font-size: 12px;
      padding-left: 2.8em;
    }
    .cookieText {
      color: #858080;
      text-align: left;
      margin-top: -10px;
      padding: 0 0 3em 0;
      font-size: 9px;
      padding-left: 3.4em;
    }
    .cookieBtn {
      height: 25vmin;
      pointer-events: none;
      animation: animate 7s linear infinite;
      background: transparent;
    }
  }
  @media (min-width: 1209px) {
    &.container {
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 10px;
    }
    section {
      &.middle {
        .cookieBtn {
          height: 37vmin;
        }
        p {
          font-size: 18px;
        }
        .cookieText {
          font-size: 14px;
        }
      }
      &.right {
        display: flex;
        flex-direction: column;
      }
      &.left {
        display: block;
        width: 350px;
        margin: -1.3em 0px -3em 4em;
        border-right: 3px solid #7B7B7E;
        border-left: 3px solid #7B7B7E;
        .container {
            display:block;
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
export default GameContainer;
