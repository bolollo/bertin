import { topo2geo } from "./topo2geo.js";
import { geoPath } from "d3-geo";
const d3 = Object.assign({}, { geoPath });

export function getheight(layers, extent, margin, projection, planar, width) {
  let ref;

  const geojsons = layers
    .map((d) => d.geojson)
    .filter((d) => d !== undefined).length;

  const types = layers.map((d) => d.type);

  // case 1: defined extent in params
  if (extent) {
    ref = extent;
  }

  // case2:  if outline is defined -> world extent
  if (
    !extent &&
    (types.includes("outline") ||
      types.includes("tissot") ||
      types.includes("geolines")) &&
    !planar
  ) {
    ref = { type: "Sphere" };
  }

  // case3 : extent defined by layers
  if (
    (!extent &&
      geojsons > 0 &&
      !types.includes("outline") &&
      !types.includes("tissot") &&
      !types.includes("geolines")) ||
    planar
  ) {
    let l = layers.map((d) => d.geojson).filter((d) => d !== undefined);
    let all = [];
    l.forEach((d) => all.push(topo2geo(d).features));
    ref = {
      type: "FeatureCollection",
      features: all.flat(),
    };
  }

  // case 4: ony tiles -> world extent
  if (!extent && geojsons == 0 && types.includes("tiles")) {
    ref = { type: "Sphere" };
  }

  // Adapt scale

  const [[x0, y0], [x1, y1]] = d3
    .geoPath(projection.fitWidth(width - margin * 2, ref))
    .bounds(ref);

  let trans = projection.translate();
  projection.translate([trans[0] + margin, trans[1] + margin]);

  return Math.ceil(y1 - y0) + margin * 2;
}
