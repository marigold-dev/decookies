import styled from "styled-components";
const HeaderButton = styled.div`
    position: absolute;
    top: 21px;
    right: 40px;
    @media (min-width: 1209px) {
        button {
            &.mobileButton {
            display:none;
            background: none;
            border: 0;
            color: inherit;
            }
        }
        button {
            &.desktopButton {
         display:block;
        }
}
    }

.desktopButton {
    display:none;
}
.mobileButton {
    display:block;
    background: none;
    border: 0;
    color: inherit;
    
}
`;
export default HeaderButton