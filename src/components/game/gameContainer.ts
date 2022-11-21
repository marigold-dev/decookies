import styled from "styled-components";

const GameContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: "Roboto Mono", monospace;
  
  .left {
    display: block;
    width: 207px;
    margin-right: 1px;
    border-right: 3px solid #7b7b7e;
    border-left: 3px solid #7b7b7e;
    .container {
      display: none;
      padding: 1em 1em;
    }
  }
  .middle {
    color: ${(props) => props.theme.palette.common.white};
    text-align: center;
    button {
      background: ${(props) => props.theme.palette.primary.main};
      border: none;
    }
    p {
      text-align: left;
      font-size: 12px;
      padding-left: 2.8em;
    }
    .cookieText {
      color: ${(props) => props.theme.palette.primary.contrastText};
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
        border-right: 3px solid #7b7b7e;
        border-left: 3px solid #7b7b7e;
        overflow: scroll;
        height: 544px;
        scrollbar-width: 10px;
        .container {
          display: block;
          padding: 1em 1em;
        }
      }
    }
  }
  @media (min-width: 1700px) {
    &.container {
      section {
        &.left {
          height: fit-content;
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
