import { TYPE_COLORS } from "../data/constants.js";
import { capitalize } from "../utils.js";

function TypeBadge({ type }) {
  return (
    <span className="type-badge" style={{ background: TYPE_COLORS[type] || "#777" }}>
      {capitalize(type)}
    </span>
  );
}

export default TypeBadge;
