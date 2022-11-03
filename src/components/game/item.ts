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
    background: #2b2a2e;
    width: inherit;
    height: inherit;
    div {
      margin: 0.5em 2em 0.5em 2em;
    }
  }
  &.modal-item {
    background: #2b2a2e;
    width: inherit;
    height: inherit;
    text-align:left;
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
      border: 1px solid #ffffff;
      color: #858080;
      font-size: 10px;
      margin-bottom: 5px;
    }

    h2 {
      color: white;
      font-size: 15px;
      margin-top: 6px;
    }
    label {
      color: white;
      margin-bottom: 5px;
      &.description {
        margin-top: -10px;
        margin-bottom: 10px;
        color: #858080;
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
      color: #858080;
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
