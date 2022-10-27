import styled from "styled-components";
import cookie from '../../../resources/images/cookie.png';

const RulesContainer = styled.div`
    font-family: "Roboto-regular";  
    padding: 0;
    width: 100%;
    justify-content:center;
    align-items:center;

    section {
        display:grid;
        grid-template-columns: 1fr;
        margin: 3.5em 1em;
        border: 1px solid #7B7B7E;
        padding: 2em 1em;

    a {
        color: white;
    }
    h3 {
        width:100%;
        color: white;
        background: #2B2A2E;
        height:36px;
        text-align: center;
        justify-content:center;
        align-items:center;
        padding-top: 0.5em;
    }
}   
`;

const Rules = () =>
    <RulesContainer>
        <section>
            <a href="/">Back</a>
            <h3>Enjoy making cookies!</h3>
            <p>Rules are easy</p>
            <ul>
                <li>Click on cookie to bake one </li>
                <li>When you have enough cookies  buy a building. Each building will passively 
                    mint cookies for you. The more buildings of the same type you buy, the more the price inscreases</li>
                <li>You can give cookies to a friend, because it is always great to get cookies from a friends</li>
                <li>Eat cookies allow you to “burn” cookies and appear in the leaderboard. Who will the best cookie eater?</li>
            </ul>
        </section>
    </RulesContainer>

export default Rules