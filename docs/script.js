var meta = [
    {name:"tig00007144", size: 1000, color: "#E41A1A"},
    {name:"tig00026480", size: 2000, color: "#E41AFC"},
    {name:"tig00003221", size: 4000, color: "#EAF11C"},
    {name:"tig00010111", size: 2000, color: "#D41B9C"},
    {name:"tig00000318", size: 2000, color: "#2C1D1E"},
    {name:"tig00009327", size: 2000, color: "#F400F0"},
    {name:"tig00025208", size: 2000, color: "#00FFFF"},
    {name:"tig00019172", size: 2000, color: "#ABBEEF"},
    {name:"tig00004923", size: 2000, color: "#0000FF"},
    {name:"chr03"      , size: 350204, color: "#FFFF00"}
];

var width = 960,
    height = 960,
    outerRadius = Math.min(width, height) / 2 - 60,
    innerRadius = outerRadius - 24;

var formatValue = d3.formatPrefix(",.0", 1e2);
var formatPos = d3.format("d");

var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

var layout = d3.chord();
layout.padAngle(.035);

var path = d3.ribbon()
    .radius(innerRadius);

var svg = d3.select(".plot").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("id", "circle")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.append("circle")
    .attr("r", outerRadius);

d3.csv("data.csv", function (r) {
    r.origin_start = parseInt(r.origin_start);
    r.origin_end = parseInt(r.origin_end);
    r.target_start = parseInt(r.target_start);
    r.target_end = parseInt(r.target_end);
    return r;
}).then(function (data) {
    ready(data);
});

function ready(matrix) {
  // Compute the chord layout.
  l_data = layout(matrix, meta);

  // Add a group per neighborhood.
  var group = svg.selectAll(".group")
      .data(l_data.groups)
      .enter().append("g")
      .attr("class", "group")
      .on("mouseover", mouseover);

  // Add a mouseover title.
  group.append("title").text(function(d, i) {
    return meta[i].name + "\nSize: " + meta[i].size;
  });

  // Add the group arc.
  var groupPath = group.append("path")
      .attr("id", function(d, i) { return "group" + i; })
      .attr("d", arc)
      .style("fill", function(d, i) { return meta[i].color; });

  var groupTick = group.selectAll(".group-tick")
    .data(function(d) { return groupTicks(d, 20); })
    .enter().append("g")
    .attr("class", "group-tick")
    .attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)"; });

  groupTick.append("line")
    .attr("x2", 6);

  groupTick
    .append("text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180) translate(-16)" : null; })
    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .text(function(d) { return formatValue(d.value); });

  // Add a text label.
  var groupText = group.append("text")
      .attr("x", 6)
      .attr("dy", 15);

  groupText.append("textPath")
      .attr("xlink:href", function(d, i) { return "#group" + i; })
      .text(function(d, i) { return meta[i].name; });


  // Remove the labels that don't fit. :(
  groupText.filter(function(d, i) { return groupPath._groups[0][i].getTotalLength() / 2 - 16 < this.getComputedTextLength(); })
      .remove();

  // Add the chords.
  var chord = svg.selectAll(".chord")
      .data(l_data)
    .enter().append("path")
      .attr("class", "chord")
      .style("fill", function(d) { return meta[d.source.index].color; })
      .attr("d", path);

  // Add an elaborate mouseover title for each chord.
  chord.append("title").text(function(d) {
    let group = l_data.groups[d.source.index];
    let k = group.value / (group.endAngle - group.startAngle);
    let o0 = formatPos((d.source.startAngle - group.startAngle) * k);
    let o1 = formatPos((d.source.endAngle - group.startAngle) * k);
    group = l_data.groups[d.target.index];
    k = group.value / (group.endAngle - group.startAngle);
    let t0 = formatPos((d.target.startAngle - group.startAngle) * k);
    let t1 = formatPos((d.target.endAngle - group.startAngle) * k);
    return meta[d.source.index].name
        + ": ( " + o0 + ", " + o1 + " )" + "\n"
        + meta[d.target.index].name
        + ": ( " + t0 + ", " + t1 + " )";
  });

  function mouseover(d, i) {
    chord.classed("fade", function(p) {
      return p.source.index != i
          && p.target.index != i;
    });
  }
}

function groupTicks(d, num) {
  var k = (d.endAngle - d.startAngle) / d.value;
  var num_ticks = (d.endAngle - d.startAngle) * (36/(Math.PI*2));
  var r = d3.ticks(0, d.value, num_ticks).map(function(value) {
    return {value: value, angle: value * k + d.startAngle};
  });
  if (r.length === 1)
      r.push({value: d.value, angle: d.value * k + d.startAngle});
  return r;
}