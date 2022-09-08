interface Props {
    value: bigint,
    cps: bigint
}

export const CookieCounter: React.FC<Props> = ({ value, cps }) => <>
    <div className="cookiesCounter">
        Cookies: {value.toString()} 
    </div>
    <div className="cpsCounter">
        Cooies per second: {cps.toString()}
    </div>
</>