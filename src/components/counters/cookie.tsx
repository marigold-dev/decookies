interface Props {
    value: bigint,
    cps: bigint
}

export const CookieCounter: React.FC<Props> = ({ value, cps }) => <>
    <div className="cookiesCounter">
    {value.toString()} baked
    </div>
    <div className="cpsCounter">
    {cps.toString()} per second
    </div>
</>