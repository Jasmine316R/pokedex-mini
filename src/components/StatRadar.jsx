import { useMemo } from "react";
import { STAT_LABELS, STAT_MAX } from "../data/constants.js";

/**
 * Polygon radar (spider) chart for the 6 base stats.
 * Pure SVG — no external library. Draws concentric grid rings,
 * axis lines + labels, and an animated glowing stat polygon.
 */

const STAT_ORDER = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
const GRID_RINGS = [0.25, 0.5, 0.75, 1]; // fractional rings
const SIZE = 300;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 110;
const LABEL_RADIUS = RADIUS + 28;

/** Convert polar to cartesian for a hex vertex */
function polarToXY(index, fraction) {
  // Start from top (-90°), go clockwise
  const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
  return {
    x: CX + Math.cos(angle) * RADIUS * fraction,
    y: CY + Math.sin(angle) * RADIUS * fraction,
  };
}

/** Build a polygon points string from 6 fractional values */
function buildPolygon(fractions) {
  return fractions
    .map((f, i) => {
      const { x, y } = polarToXY(i, f);
      return `${x},${y}`;
    })
    .join(" ");
}

/** Build a ring polygon at a uniform fraction */
function buildRing(fraction) {
  return Array.from({ length: 6 }, (_, i) => {
    const { x, y } = polarToXY(i, fraction);
    return `${x},${y}`;
  }).join(" ");
}

function StatRadar({ stats, accentColor = "#ff4d4d" }) {
  // Map API stats array into our ordered fractions
  const statMap = useMemo(() => {
    const map = {};
    stats.forEach((s) => {
      map[s.stat.name] = s.base_stat;
    });
    return map;
  }, [stats]);

  const fractions = STAT_ORDER.map((key) => Math.min(1, (statMap[key] || 0) / STAT_MAX));
  const statPoints = buildPolygon(fractions);

  return (
    <div className="radar-wrap" role="img" aria-label="Base stats radar chart">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="radar-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow filter for the stat polygon */}
          <filter id="radar-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid rings */}
        {GRID_RINGS.map((ring) => (
          <polygon
            key={ring}
            points={buildRing(ring)}
            className="radar-ring"
          />
        ))}

        {/* Axis lines from center to each vertex */}
        {STAT_ORDER.map((_, i) => {
          const { x, y } = polarToXY(i, 1);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={x}
              y2={y}
              className="radar-axis"
            />
          );
        })}

        {/* Stat polygon with glow */}
        <polygon
          points={statPoints}
          className="radar-polygon"
          style={{
            fill: accentColor,
            stroke: accentColor,
          }}
          filter="url(#radar-glow)"
        />

        {/* Stat labels + values around the perimeter */}
        {STAT_ORDER.map((key, i) => {
          const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
          const lx = CX + Math.cos(angle) * LABEL_RADIUS;
          const ly = CY + Math.sin(angle) * LABEL_RADIUS;
          const label = STAT_LABELS[key] || key;
          const value = statMap[key] || 0;

          // Text anchor based on position
          let anchor = "middle";
          if (Math.cos(angle) < -0.3) anchor = "end";
          else if (Math.cos(angle) > 0.3) anchor = "start";

          // Nudge dy based on vertical position
          const dy = Math.sin(angle) > 0.3 ? "1em" : Math.sin(angle) < -0.3 ? "-0.3em" : "0.35em";

          return (
            <g key={key}>
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                dy={dy}
                className="radar-label"
              >
                {label}
              </text>
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                dy={Math.sin(angle) > 0.3 ? "2.1em" : Math.sin(angle) < -0.3 ? "-.9em" : "1.6em"}
                className="radar-value"
              >
                {value}
              </text>
            </g>
          );
        })}

        {/* Small dots at each stat vertex */}
        {STAT_ORDER.map((key, i) => {
          const { x, y } = polarToXY(i, fractions[i]);
          return (
            <circle
              key={key}
              cx={x}
              cy={y}
              r={3.5}
              className="radar-dot"
              style={{ fill: accentColor }}
            >
              <title>{`${STAT_LABELS[key]}: ${statMap[key]}`}</title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
}

export default StatRadar;
