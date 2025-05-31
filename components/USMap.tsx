"use client"

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const TOPO_JSON = "/us-states-10m.json";

export default function USMap({ collected = {} }: { collected?: Record<string, boolean> }) {
  // Memoize coloring for performance
  const getFill = (geo: any) => {
    // FIPS code to state abbreviation mapping (partial, for demo)
    const fipsToAbbr: Record<string, string> = {
      "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO", "09": "CT", "10": "DE", "11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN", "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN", "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH", "34": "NJ", "35": "NM", "36": "NY", "37": "NC", "38": "ND", "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI", "56": "WY"
    };
    const abbr = fipsToAbbr[geo.id];
    return abbr && collected[abbr] ? "#60a5fa" : "#e5e7eb";
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <ComposableMap projection="geoAlbersUsa" width={800} height={500} style={{ width: "100%", height: "auto" }}>
        <Geographies geography={TOPO_JSON}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={getFill(geo)}
                stroke="#374151"
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#fbbf24", outline: "none" },
                  pressed: { fill: "#f87171", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}