"use client"

import { ComposableMap, Geographies, Geography, Annotation } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { useState } from "react";
// Removed: import { US_STATES } from "@/lib/us-states";

const TOPO_JSON = "/us-states-10m.json";

// FIPS code to state abbreviation mapping
const fipsToAbbr: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO", "09": "CT", "10": "DE", "11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN", "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN", "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH", "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND", "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI", "56": "WY"
};

export default function USMap({ collected = {} }: { collected?: Record<string, boolean> }) {
  // Removed: const [selectedState, setSelectedState] = useState<string | null>(null);
  const [showName, setShowName] = useState<string | null>(null);
  // Map abbreviation to full name for tooltip
  const abbrToName: Record<string, string> = {
    AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming"
  };
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative">
      <ComposableMap projection="geoAlbersUsa" width={800} height={500} style={{ width: "100%", height: "auto" }}>
        <Geographies geography={TOPO_JSON}>
          {({ geographies }) => (
            <>
              {geographies.map((geo) => {
                const abbr = fipsToAbbr[geo.id];
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={abbr && collected[abbr] ? "#22c55e" : "#e5e7eb"}
                    stroke="#374151"
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#bbf7d0", outline: "none" },
                      pressed: { fill: "#16a34a", outline: "none" },
                    }}
                    onClick={() => abbr && setShowName(abbrToName[abbr])}
                  />
                );
              })}
              {geographies.map((geo) => {
                const abbr = fipsToAbbr[geo.id];
                if (!abbr) return null;
                const centroid = geoCentroid(geo);
                const isFlorida = abbr === "FL";
                const dx = isFlorida ? 12 : 0;
                const dy = isFlorida ? 10 : 0;
                return (
                  <Annotation
                    key={geo.rsmKey + "-label"}
                    subject={centroid}
                    dx={dx}
                    dy={dy}
                    connectorProps={{}}
                    style={{ pointerEvents: "none" }}
                  >
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      alignmentBaseline="central"
                      fontSize={14}
                      fontWeight="bold"
                      fill="#374151"
                    >
                      {abbr}
                    </text>
                  </Annotation>
                );
              })}
            </>
          )}
        </Geographies>
      </ComposableMap>
      {showName && (
        <div className="absolute left-1/2 top-4 transform -translate-x-1/2 bg-white border border-gray-300 rounded shadow px-4 py-2 text-lg font-semibold z-10">
          {showName}
          <button className="ml-4 text-gray-500 hover:text-gray-700" onClick={() => setShowName(null)}>✕</button>
        </div>
      )}
    </div>
  );
}