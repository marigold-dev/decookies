import styled from "styled-components";
import item from "../../../resources/images/info-bg.png";

const Item = styled.div`
  width: 450px;
  height: 188px;
  background-image: url(${item});
  background-size: contain;
  background-position: center;
  margin: 0.5em 0;
  background-repeat: no-repeat;

  &.player-info {
    position: absolute;
    background: ${props =>props.theme.palette.common.darkGray};
    width: inherit;
    height: inherit;
    div {
      margin: 0.5em 2em 0.5em 2em;
    }
  }
  &.modal-item {
    background: ${props =>props.theme.palette.common.darkGray};
    width: inherit;
    height: inherit;
    text-align:left;
    margin: 1.5em 0;
  }
  @media (min-width: 1209px) {
    &.player-info {
      display: none;
    }
  }

  div {
    margin: 0.5em 7em 0.5em 8em;
    display: flex;
    flex-direction: column;
    font-size: 10px;

    input {
      background: #383539;
      border: 1px solid  ${props =>props.theme.palette.common.white};;
      color: ${props =>props.theme.palette.primary.contrastText};;
      font-size: 10px;
      margin-bottom: 5px;
    }

    h2 {
      color: ${props =>props.theme.palette.common.white};
      font-size: 15px;
      margin-top: 6px;
    }
    label {
      color: ${props =>props.theme.palette.common.white};
      margin-bottom: 5px;
      &.description {
        margin-top: -10px;
        margin-bottom: 10px;
        color: ${props =>props.theme.palette.primary.contrastText};;
      }
    }
    .buttonContainer {
      display: flex;
      flex-direction: row;
      width: 100%;
      margin-left: -0.5em;
      button {
        width: 100px;
        margin: 0.2em 1em;
      }
    }

    .address {
      margin-top: -16px;
      color: ${props =>props.theme.palette.primary.contrastText};
      font-size: 10px;
      display: flex;
      .description {
        text-overflow: ellipsis;
        overflow: hidden;
        width: 40%;
      }
    }
  }
`;
export default Item;
