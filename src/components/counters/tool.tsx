interface Props {
    value: number
}

export const ToolCounter: React.FC<Props> = ({ value }) =>
    <span className="toolsCounter">
        {value}
    </span>