interface Props {
    value: bigint
}

export const ToolCounter: React.FC<Props> = ({ value }) =>
    <span className="toolsCounter">
        {value.toString()}
    </span>