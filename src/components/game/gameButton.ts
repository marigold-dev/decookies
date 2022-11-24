import styled from "styled-components";

const GameButton = styled.button`
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  line-height: normal;
  overflow: visible;
  padding: 0;
  .gameButtonContainer {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-content: center;
    align-items: center;
    padding: 0 0.5em 0.2em 0.5em;
    height:auto;
    font-size: 8px;
    color: ${props =>props.theme.palette.primary.contrastText};
    width: 196px;
    h3 {
      color: ${props =>props.theme.palette.common.white};
    }
    .background {
      justify-content: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      background: ${props =>props.theme.palette.common.darkGray};
      margin: 0.3em;
      margin: 0.3em;
      height: 53px;
      width: 58px;

    }
    .title {
      margin: 0.5em 0 0.7em 0;
      text-align: left;
    }
    img {
      width: 15px;
      height: 15px;
      padding: 0 0.5em;
      &.price {
        width: 12px;
        height: 12px;
        padding-right: 1em;
        margin-left: -1em;
      }
    }
  }
  &.column {
    display: flex;
    flex-direction: column;
    width: 60px;
    &.price {
      display: flex;
      flex-direction: row;
    }
  }
  @media (min-width: 768px) {
    div {
      &.gameButtonContainer {
        padding: 0 1em 0.5em 1em;
        height: 7em;
        font-size: 12px;
        width: auto;
        h3 {
          color: ${props =>props.theme.palette.common.white};
        }
        .background {
          margin: 0.3em;
          height: 77px;
          width:95px;

          &.value {
            width:70px;
          }
        }
        img {
          width: 30px;
          height: 30px;
          padding: 0 1em;
          &.price {
            width: 12px;
            height: 12px;
            padding-right: 1em;
            margin-left: -1em;
          }
        }
      }
      &.column {
        width: 90px;
        &.price {
          display: flex;
          flex-direction: row;
        }
      }
    }
  }
`;

export default GameButton;
