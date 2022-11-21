import styled from "styled-components";
import item from "../../../resources/images/info-bg.png";

const Item = styled.div`
    background: ${props =>props.theme.palette.common.darkGray};
  &.playerInfo {
    max-width: 13.3em;
    div {
      margin:0;
      padding:2em;
      .address {
        font-size:7px ;
      }
    }
  };
  &.eatCookies {
    display:none;
  }
  &.transferCookies {
    display:none;
  }

  &.modal-item {
    background: ${props =>props.theme.palette.common.darkGray};
    width: inherit;
    height: inherit;
    text-align:left;
    margin: 1.5em 0;
  }
  @media (min-width: 1209px) {
    margin-left: 0;
    padding: 0;
    background:none;
    width: 450px;
    background-image: url(${item});
    background-size: 79% 112%;
    background-position: 3em -0.5cm;
    margin: 0.5em 0;
    background-repeat: no-repeat;
  &.playerInfo {
    max-width: none;
    div {
      margin: 0.5em 7em 0.5em 8em;
      padding:0;
    }
    background-size: 79% 110%;
    height: 206px;
    button {
      margin-top:6px;
      max-width: 40%;
    }
  }
  &.eatCookies {
    display:block;
    height: 147px;
  }
  &.transferCookies {
    display:block;
    background-size: 79% 110%;
    height: 200px;
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
    }
  }
`;
export default Item;
