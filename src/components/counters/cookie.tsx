interface Props {
    value: bigint,
    cps: bigint
}

export const CookieCounter: React.FC<Props> = ({ value, cps }) => <>
    <div className="cookiesCounter">
        {value.toString()} cookies
    </div>
    <div className="cpsCounter">
        per second: {cps.toString()}
    </div>
</>