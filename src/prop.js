// Imports
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);
import { plotHeader, plotFooter, plotGraticule, plotOutline, getHeight} from "./helpers/layout.js";
import { propLayer } from "./helpers/layer-prop.js";
//import { getcenters } from "./helpers/utils.js";

// Nicolas Lambert, 2021
export function prop({
  features, // Compulsory
  id, // Compulsory
  radius, // Compulsory
  width = 1000,
  projection = d3.geoPatterson(),
  fill,
  stroke,
  strokewidth,
  fillopacity,
  header = null,
  footer = null,
  graticule = null,
  outline = null,
  scalebar = null
} = {}) {
  // heights
  let height = getHeight(features, projection, width, outline);
  let heightHeader = 0;
  if (header) {
    if (header.text) {
      heightHeader = 20;
    }
    if (header.fontsize) {
      heightHeader = header.fontsize;
    }
  }
  let heightFooter = 0;
  if (footer) {
    if (footer.text) {
      heightFooter = 20;
    }
    if (footer.fontsize) {
      heightFooter = footer.fontsize;
    }
  }

  // svg document
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height + heightHeader + heightFooter)
    .attr("viewBox", [
      0,
      -heightHeader,
      width,
      height + heightHeader + heightFooter
    ])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  // clipPath
  svg
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height);

  // Outline (fill)
  if (outline) {
    plotOutline(svg, projection, {
      fill: outline.fill,
      stroke: "none",
      strokewidth: "none"
    });
  }

  // Graticule
  if (graticule) {
    plotGraticule(svg, projection, {
      stroke: graticule.stroke,
      strokewidth: graticule.strokewidth,
      strokeopacity: graticule.strokeopacity,
      strokedasharray: graticule.strokedasharray,
      step: graticule.step
    });
  }

  // -----------------------------------------------
  // Layer
  if (features) {
    propLayer(svg, projection, features, {
      fill: fill,
      stroke: stroke,
      strokewidth: strokewidth,
      fillopacity: fillopacity,
      id: "ISO3_CODE",
      radius: 10
    });
  }
  // -----------------------------------------------

  // Outline (stroke)
  if (outline) {
    plotOutline(svg, projection, {
      fill: "none",
      stroke: outline.stroke,
      strokewidth: outline.strokewidth
    });
  }

  // Header
  if (header) {
    plotHeader(svg, width, {
      fontsize: header.fontsize,
      text: header.text,
      fill: header.fill
    });
  }

  // Footer
  if (footer) {
    plotFooter(svg, width, height, {
      fontsize: footer.fontsize,
      text: footer.text,
      fill: footer.fill
    });
  }

  // Scalebar
  if (scalebar) {
    plotScalebar(svg, projection, width, height, {
      x: scalebar.x,
      y: scalebar.y,
      dist: scalebar.dist
    });
  }

  return Object.assign(svg.node(), {});
}
