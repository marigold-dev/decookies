interface Props {
    value: number,
    cps: number
}

export const CookieCounter: React.FC<Props> = ({ value, cps }) => <>
    <div className="cookiesCounter">
        Cookies:  {value} 
    </div>
    <div className="cpsCounter">
       Cookies per second: {cps}
    </div>
</>