export const ContentBorderDashed = () => {
  return(
    <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
              viewBox="0 0 400 200"
              fill="none"
              preserveAspectRatio="none"
            >
              <rect
                x="12"
                y="12"
                width="376"
                height="176"
                rx="12"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="18 4 3 6 6 4"
                fill="none"
                opacity="1"
              />
            </svg>
  )
}