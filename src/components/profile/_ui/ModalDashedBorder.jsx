export const ModalDashedBorder = ({ className, style = {} }) => (
    <svg 
        className={className}
        style={{
            ...style,
            left: '4px',
            top: '4px',
            right: '4px',
            bottom: '4px',
            width: 'calc(100% - 8px)',
            height: 'calc(100% - 8px)',
        }}
        preserveAspectRatio="none"
    >
        <rect 
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="5"
            ry="5"
            stroke="rgb(255, 171, 47)"
            strokeWidth="1.5"
            strokeLinecap="square"
            strokeLinejoin="round"
            strokeDasharray="20 4 3 6 6 4"
            fill="none"
            vectorEffect="non-scaling-stroke"
        />
    </svg>
);