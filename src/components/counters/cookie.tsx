interface Props {
    value: number,
    cps: number
}

export const CookieCounter: React.FC<Props> = ({ value, cps }) => <>
    <div className="cookiesCounter">
        {value} cookies
    </div>
    <div className="cpsCounter">
        per second: {cps}
    </div>
</>