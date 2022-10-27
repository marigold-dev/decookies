interface Props {
    value: bigint,
    cps: bigint
}

export const CookieCounter: React.FC<Props> = ({ value, cps }) => <>
    <div className="cookiesCounter">
        Baked cookies: {value.toString()}
    </div>
    <div className="cpsCounter">
        Cookies per second: {cps.toString()}
    </div>
</>