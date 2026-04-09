const PathVisualizer = ({ pathSegments, currentMap, firstSegment, lastSegment }) => {
  // Filter segments for current floor
  const floorSegments =
    currentMap === 1
      ? pathSegments.filter((s) => s.startsWith("rect") || s.startsWith("g"))
      : pathSegments.filter((s) => s.startsWith("p") || s === "sf")

  if (floorSegments.length === 0) return null

  // Map segment IDs to SVG path coordinates
  const segmentPaths = {
    // Ground Floor (+120 X-axis)
    rect26: "M166.75,253 H183 v15 H166.75 Z",
    rect27: "M183,253 h67.5 v15 H183 Z",
    rect28: "M250.5,253 H269 v15 h-18.5 Z",
    rect29: "M269,253 h20.70563 v15 H269 Z",
    rect30: "M289.70563,253 h71.47323 v15 h-71.47323 Z",
    rect31: "M361.17886,253 h18.50611 v15 h-18.50611 Z",
    rect32: "M379.68497,253 H394.875 v15.125 h-15.19003 Z",
    rect33: "M394.875,253 H410.5 v15.125 h-15.625 Z",
    rect35: "M410.5,253 h90.277 v15 H410.5 Z",
    rect36: "M500.77701,253 h13.78857 v15 h-13.78857 Z",
    rect37: "M514.56558,253 H544.25 v15 h-29.68442 Z",
    rect38: "M544.25,253 h24.25 v15 h-24.25 Z",
    rect39: "M568.5,253 h57.96523 v15 H568.5 Z",
    rect40: "M626.46524,253 h15.20279 v15 h-15.20279 Z",
    rect41: "M171.97235,119 h17.67767 v17 h-17.67767 Z",
    rect42: "M189.29646,119 h61.20266 v17 H189.29646 Z",
    rect43: "M250.49911,119 H269 v17.00781 h-18.50089 Z",
    rect44: "M269,119 h12.22035 v17 H269 Z",
    rect45: "M281.22035,119 h17.76605 v17 h-17.76605 Z",
    rect46: "M298.9864,119 h38.7141 v17 h-38.7141 Z",
    rect47: "M337.7005,119 h15.73313 v17 H337.7005 Z",
    rect48: "M353.43362,119 H394.75 v16.99609 h-41.31638 Z",
    rect49: "M394.75,119 h15.75391 v17 H394.75 Z",
    rect50: "M410.50391,119 h15.8501 v17 h-15.8501 Z",
    rect51: "M426.354,119 h94.57554 v17 H426.354 Z",
    rect52: "M520.92953,119 h23.32639 v17 h-23.32639 Z",
    rect53: "M544.25592,119 h24.23627 v17 h-24.23627 Z",
    rect54: "M568.5,119 h59.20267 v17 H568.5 Z",
    rect55: "M627.70267,119 h11.13693 v17 h-11.13693 Z",
    rect56: "M638.8396,119 H651.5 v17 h-12.6604 Z",
    rect57: "M544.25592,136 H568.5 v7.18912 h-24.24408 Z",
    rect58: "M544.25592,143.18912 H568.5 v13.43503 h-24.24408 Z",
    rect59: "M544.25592,156.62415 H568.5 V253 h-24.24408 Z",
    rect60: "M394.75,182.25677 h15.75 v10.07628 h-15.75 Z",
    rect61: "M394.75,135.99609 h15.75 v46.26068 h-15.75 Z",
    rect62: "M394.75,192.33305 h15.75 V253 h-15.75 Z",
    rect63: "M394.875,268.125 H410.5 v50.125 h-15.625 Z",
    rect64: "M394.875,318.25 h15.62567 v57.09351 H394.875 Z",
    rect65: "M250.49911,136.00781 H269 v4.80469 h-18.50089 Z",
    rect66: "M250.49911,140.8125 H269 V154.75 h-18.50089 Z",
    rect67: "M250.49911,154.75 H269 V253 h-18.50089 Z",

    // First Floor (+120 X-axis)
    p1: "M251.87541,126.57211 H279.25 v21.56284 h-27.37459 Z",
    p2: "M279.25,126.57211 h21.41578 v21.56675 H279.25 Z",
    p3: "M300.66579,126.57211 h82.02438 v21.56675 h-82.02438 Z",
    p4: "M382.69019,126.57211 h16.97359 v21.56675 h-16.97359 Z",
    p5: "M414.78879,126.57211 h54.69874 v21.56675 h-54.69874 Z",
    p6: "M469.48752,126.57211 h26.33973 v21.56675 h-26.33973 Z",
    p7: "M495.82724,126.57211 h26.15515 v21.56675 h-26.15515 Z",
    p8: "M521.9902,126.57211 h29.48434 v21.56675 H521.9902 Z",
    p9: "M551.47617,126.57211 h51.65454 v21.56675 h-51.65454 Z",
    p10: "M603.13071,126.57211 h13.83804 v21.56675 h-13.83804 Z",
    p11: "M616.96875,126.57211 h11.61774 v21.56674 h-11.61774 Z",
    p12: "M251.87541,148.13495 H279.25 v87.92755 h-27.37459 Z",
    p13: "M251.87541,236.0625 H279.25 v21.76242 h-27.37459 Z",
    p14: "M179.39697,257.82883 h14.49569 v18.49524 H179.39697 Z",
    p15: "M193.89265,257.82883 h57.98276 v18.49524 H193.89265 Z",
    p16: "M251.87541,257.82883 H279.25 v18.49524 h-27.37459 Z",
    p17: "M279.25,257.82883 h146.92725 v18.49524 H279.25 Z",
    p18: "M426.17725,257.82883 h18.208 v18.49524 h-18.208 Z",
    p19: "M444.38525,257.82883 h77.60495 v18.49524 h-77.60495 Z",
    p20: "M521.9902,257.82883 h29.48597 v18.49524 H521.9902 Z",
    p21: "M551.47617,257.82883 H607.375 v18.49524 h-55.89883 Z",
    p22: "M607.375,257.82883 h20.25 v18.49524 h-20.25 Z",
    p23: "M521.98239,148.13885 h29.49378 V232.75 h-29.49378 Z",
    p24: "M521.98239,232.75 h29.49378 v25.07883 h-29.49378 Z",
    rect101: "M399.66379,126.57211 h15.12502 v21.56675 h-15.12502 Z",
  }

  // Helper function to calculate center point of a segment
  const calculateCenterPoint = (pathData) => {
    // Parse the path data to extract coordinates
    // This is a simplified approach that works for rectangular paths
    const matches = pathData.match(/M([\d.]+),([\d.]+).*?h([\d.]+).*?v([\d.]+)/)

    if (matches) {
      const x = Number.parseFloat(matches[1])
      const y = Number.parseFloat(matches[2])
      const width = Number.parseFloat(matches[3])
      const height = Number.parseFloat(matches[4])

      return {
        x: x + width / 2,
        y: y + height / 2,
      }
    }

    // Alternative parsing for different path format
    const altMatches = pathData.match(/M([\d.]+),([\d.]+).*?H([\d.]+).*?v([\d.]+)/)

    if (altMatches) {
      const x = Number.parseFloat(altMatches[1])
      const y = Number.parseFloat(altMatches[2])
      const endX = Number.parseFloat(altMatches[3])
      const height = Number.parseFloat(altMatches[4])

      return {
        x: (x + endX) / 2,
        y: y + height / 2,
      }
    }

    // Default fallback if parsing fails
    return { x: 0, y: 0 }
  }

  // Determine segment type (first, last, or regular)
  const getSegmentType = (segment) => {
    if (segment === firstSegment) return "first"
    if (segment === lastSegment) return "last"
    return "regular"
  }

  // Find first and last segments in the current floor
  const firstSegmentInFloor = floorSegments.find((s) => s === firstSegment)
  const lastSegmentInFloor = floorSegments.find((s) => s === lastSegment)

  // Calculate center points for first and last segments
  const firstSegmentCenter = firstSegmentInFloor ? calculateCenterPoint(segmentPaths[firstSegmentInFloor]) : null

  const lastSegmentCenter = lastSegmentInFloor ? calculateCenterPoint(segmentPaths[lastSegmentInFloor]) : null

  return (
    <svg className="path-overlay" width="100%" height="100%" preserveAspectRatio="none">
      {/* Define markers/symbols */}
      <defs>
        <marker
          id="start-marker"
          viewBox="0 0 24 24"
          refX="12"
          refY="12"
          markerWidth="12"
          markerHeight="12"
          orient="auto"
        >
          <circle cx="12" cy="12" r="8" fill="#4CAF50" stroke="#388E3C" strokeWidth="2" />
          <path d="M8,12 L16,8 L16,16 Z" fill="white" />
        </marker>

        <marker
          id="end-marker"
          viewBox="0 0 24 24"
          refX="12"
          refY="12"
          markerWidth="12"
          markerHeight="12"
          orient="auto"
        >
          <circle cx="12" cy="12" r="8" fill="#F44336" stroke="#D32F2F" strokeWidth="2" />
          <path d="M9,8 L9,16 L17,12 Z" fill="white" />
        </marker>
      </defs>

      {/* Render path segments */}
      {floorSegments.map((segment, index) => {
        const pathData = segmentPaths[segment]
        if (!pathData) {
          console.warn(`No path data found for segment: ${segment}`)
          return null
        }

        // Determine segment type and set appropriate colors
        const segmentType = getSegmentType(segment)

        // Set colors based on segment type
        let fillColor, strokeColor

        switch (segmentType) {
          case "first":
            fillColor = "#4CAF50" // Green fill for first segment
            strokeColor = "#388E3C" // Darker green stroke
            break
          case "last":
            fillColor = "#F44336" // Red fill for last segment
            strokeColor = "#D32F2F" // Darker red stroke
            break
          default:
            fillColor = "#2196F3" // Blue fill for regular segments
            strokeColor = "#1976D2" // Darker blue stroke
        }

        return (
          <path
            key={index}
            d={pathData}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="2"
            fillOpacity="0.7"
            strokeOpacity="0.9"
            strokeLinejoin="round"
          />
        )
      })}

      {/* Start Symbol */}
      {firstSegmentCenter && (
        <g className="start-symbol">
          <circle
            cx={firstSegmentCenter.x}
            cy={firstSegmentCenter.y}
            r="10"
            fill="#4CAF50"
            stroke="white"
            strokeWidth="2"
          />
          <text
            x={firstSegmentCenter.x}
            y={firstSegmentCenter.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            S
          </text>
        </g>
      )}

      {/* End Symbol */}
      {lastSegmentCenter && (
        <g className="end-symbol">
          <circle
            cx={lastSegmentCenter.x}
            cy={lastSegmentCenter.y}
            r="10"
            fill="#F44336"
            stroke="white"
            strokeWidth="2"
          />
          <text
            x={lastSegmentCenter.x}
            y={lastSegmentCenter.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            E
          </text>
        </g>
      )}
    </svg>
  )
}

export default PathVisualizer

