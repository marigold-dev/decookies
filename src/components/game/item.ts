import styled from "styled-components";
import item from '../../../resources/images/info-bg.png';

const Item = styled.div`
        width: 450px;
        height: 175px;
        background-image: url(${item});
        background-size: contain;
        background-position: center;
        margin: 0.5em 0;
        background-repeat: no-repeat;
`;
export default Item