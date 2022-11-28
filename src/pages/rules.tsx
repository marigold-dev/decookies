import cookie from '../../resources/images/cookie.png';
import desktop from '../../resources/images/desktop-bg.png';
import RulesContainer from '../components/rules';

const Rules = () =>
    <RulesContainer>
        <section className="left">
            <h2>Enjoy making cookies!</h2>
            <p>Rules are easy</p>
            <ul>
                <li>Click on the giant cookie to bake one cookie! </li>
                <li>When you have enough cookies  buy a building! Each building will passively 
                    mint cookies for you. The more buildings of the same type you buy, the more the price inscreases.</li>
                <li>You can give cookies to a friend (because it is always great to get cookies from friends).</li>
                <li>"Eat cookies" allow you to “burn” cookies and appear in the leaderboard. Who will the best cookie eater?</li>
            </ul>
            <p> ⚠️ Not yet mobile compatible! </p>
        </section>
        <section className="right">
            <a href="/"><img className="cookie" src={cookie} alt="cookie" /></a>
            <img src={desktop} alt="desktop-bg"></img>
        </section>
    </RulesContainer>

export default Rules