import styled from "styled-components";

const Modal = styled.div`
  p {
    margin-bottom: 20px;
  }

  h3 {
    color: white;
    font-size:15px;
  }

  .btn-close {
    color: #aaa;
    font-size: 30px;
    text-decoration: none;
    position: absolute;
    right: 15px;
    top: 0;
  }
  .btn-close:hover {
    color: #919191;
  }
  .modal:before {
    content: "";
    display: none;
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
  }
  .modal:target:before {
    display: block;
  }
  .modal:target .modal-dialog {
    -webkit-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    transform: translate(0, 0);
    top: 20%;
  }
  .modal-dialog {
    border: 1px solid white;
    background: #1c1d22;
    margin-left: -500px;
    position: fixed;
    left: 50%;
    top: -100%;
    z-index: 11;
    -webkit-transform: translate(0, -500%);
    -ms-transform: translate(0, -500%);
    transform: translate(0, -500%);
    -webkit-transition: -webkit-transform 0.3s ease-out;
    -moz-transition: -moz-transform 0.3s ease-out;
    -o-transition: -o-transform 0.3s ease-out;
    transition: transform 0.3s ease-out;
  }
  .modal-body {
    text-align: center;
    padding: 20px;
  }
  .modal-header {
    padding: 10px 20px;
  }

  table {
    color: white;
    width: 600px;
    line-height: 30px;
    border: 1px solid white;
    margin: 0 auto;
    border-collapse: collapse;
    th {
        border: 1px solid white;
    }
  }
`;

export default Modal;
