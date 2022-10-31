import styled from "styled-components";
interface Props {
  dark?: boolean;}

const Button = styled.button<Props>`
  display: inline-block;
  background-color: ${props  => props.dark ? '#2B2A2E' : '#D8464E'};

  padding: .8em 1em;
  color: white;
  font-size: 100%;
  text-align: center;
  text-decoration-line: underline;
  cursor: pointer;
  border: ${props  => props.dark ? '1px solid' : '1px solid #D8464E'}; 
  line-height:1;
`;
export default Button
