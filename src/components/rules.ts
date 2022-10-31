import styled from "styled-components";
import cookie from '../../resources/images/cookie.png';

const RulesContainer = styled.div`
    padding: 0;
    width: 100%;
    justify-content:center;
    align-items:center;
    font-family: 'Roboto Mono', monospace;

    @media (min-width: 900px) {
        display:grid;
        grid-template-columns: 1fr 1fr;

    section {
        justify-content:left;
        align-items:left;
        &.right, &.left {
            border: hidden;
            display:block;
        }
        &.right {
            margin: -10px;
            a {
                position:absolute;
                top:200px;
                right:50px;
            }
            img {
                margin-left:0.8em;
                width:100%;
                height:600px;
                &.cookie{
                    height:300px;
                    width:300px;
                    animation: diving 2s ease-in-out infinite, diving-rotate 2s ease-in-out infinite;
                }
                
            }
        }
        &.left {
            padding:0 2em;
            margin-top:-50px;
            h2 {
                background: none;
                text-align: left;
                font-size:27px;
            }
            a {
                font-size:18px;
            }
            p {
                font-size:20px;
                padding-bottom: 1em;
            }
            li{
                font-size:14px;
                padding-bottom: 2em;
            }
        }
    }
    
  }
  @media (min-width: 1320px) {
    section {
        &.right {
            a {
                right:160px;
            }
        }
    }
  }
  .right {
            display: none;
        }
    section {
        margin: 3.5em 1em;
        border: 1px solid #7B7B7E;
        padding: 1.8em 1em;

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
    @keyframes diving {
        0% {
                margin-top:15px;
        }
        50% {
                margin-top:50px;
        }

        100% {
                margin-top:15px;
        }
    }
    @keyframes diving-rotate {
        0% {
                transform:rotate(0deg); 
        }
        50% {
                transform:rotate(3deg); 
        }
        75% {
            transform:rotate(-2deg); 
        }
        100% {
            transform:rotate(0deg); 
        }
    }

`;
export default RulesContainer