import styled from "styled-components";
const HeaderButton = styled.div`
    position: absolute;
    top: 18px;
    right: 35px;
    @media (min-width: 1209px) {
        top: 18px;
        right: 40px;
        button {
            &.mobileButton {
            display:none;
            border: 0;
            color: inherit;
            height:30px;
            }
        }
    }
.mobileButton {
    display:block;
    background: none;
    border: 0;
    color: inherit;
    
}
`;
export default HeaderButton