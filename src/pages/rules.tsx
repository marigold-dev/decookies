import styled from "styled-components";
import cookie from '../../resources/images/cookie.png';
import back from '../../resources/images/back.png';

const RulesContainer = styled.div`
    padding: 0;
    width: 100%;
    justify-content:center;
    align-items:center;
    font-family: 'Roboto Mono', monospace;

    section {
        display:grid;
        grid-template-columns: 1fr;
        margin: 3.5em 1em;
        border: 1px solid #7B7B7E;
        padding: 2em 1em;

        a {
            color: white;
            font-weight: 400;
            font-size:14px;
            img {
                height:12px;
                padding-right:0.3em;
            }
        }
        h2 {
            margin: 0.6rem 0;
            width:100%;
            color: white;
            background: #2B2A2E;
            height:36px;
            text-align: center;
            justify-content:center;
            align-items:center;
            padding-top: 1.2em;
            font-size:15px;
        }
        p {
            color:#858080;
            margin:0;
            font-size:15px;
        }

        ul {
        list-style: none;
        padding-left: 0;
        }

        li {
            position: relative;
            padding-left: 20px;
            color:#B8B9BA;
            font-size:12px;
            padding-bottom: 1.2em;

        }
        li:before {
        content: '';
        width: 12px;
        height: 12px;
        position: absolute;
        background-image: url(${cookie});
        background-size: cover;
        background-position: center;
        left: 0;
        top: 0.8em;
        transform: translateY(-50%);
}
    }
`;

const Rules = () =>
    <RulesContainer>
        <section>
            <a href="/"><img src={back}></img>Back</a>
            <h2>Enjoy making cookies!</h2>
            <p>Rules are easy</p>
            <ul>
                <li>Click on cookie to bake one </li>
                <li>When you have enough cookies  buy a building. Each building =&gt; will passively 
                    mint cookies for you. The more buildings of the same type you buy, the more the price inscreases</li>
                <li>You can give cookies to a friend, because it is always great to get cookies from a friends</li>
                <li>Eat cookies allow you to “burn” cookies and appear in the leaderboard. Who will the best cookie eater?</li>
            </ul>
        </section>
    </RulesContainer>

export default Rules