var tape = require("tape"),
    d3 = require("../");

require("./inDelta");

// From http://mkweb.bcgsc.ca/circos/guide/tables/
var obj = [
    {origin:"Agent", target:"Agent", origin_start: 100, origin_end: 200, target_start:4700, target_end:4800},
    {origin:"Agent", target:"Agent", origin_start:1000, origin_end:1200, target_start:3300, target_end:3500},
    {origin:"Agent", target:"Agent", origin_start:2000, origin_end:2300, target_start:4200, target_end:4600}
];
var meta = [
  {name:"Agent", size:5000, color:"#DEADBE"}
]

tape("d3.chord() has the epxected defaults", function(test) {
  var chord = d3.chord();
  test.equal(chord.padAngle(), 0);
  test.equal(chord.sortGroups(), null);
  var chords = chord(obj, meta);
  test.inDelta(chords.groups, [
    {endAngle: 6.283185307179586, index: 0, startAngle: 0.0000000, value: 5000}
  ]);
  test.inDelta(chords, [{
    source: {index: 0, subindex: 0, startAngle: 0.12566370614359174, endAngle: 0.25132741228718347, value: 100},
    target: {index: 0, subindex: 0, startAngle: 5.906194188748811  , endAngle: 6.031857894892402  , value: 100}}, {
    source: {index: 0, subindex: 0, startAngle: 1.2566370614359172 , endAngle: 1.5079644737231006 , value: 200},
    target: {index: 0, subindex: 0, startAngle: 4.146902302738527  , endAngle: 4.39822971502571   , value: 200}}, {
    source: {index: 0, subindex: 0, startAngle: 2.5132741228718345 , endAngle: 2.8902652413026098 , value: 300},
    target: {index: 0, subindex: 0, startAngle: 5.277875658030853  , endAngle: 5.7805304826052195 , value: 400}}
  ]);
  test.end();
});

tape("chord.padAngle(angle) sets the pad angle", function(test) {
  var chord = d3.chord();
  test.equal(chord.padAngle(0.05), chord);
  test.equal(chord.padAngle(), 0.05);
  var chords = chord(obj, meta);
  test.inDelta(chords.groups, [
      {index: 0, startAngle: 0, endAngle: 6.233185307179586, value: 5000}
  ]);
  test.inDelta(chords, [{
    source: {index: 0, subindex: 0, startAngle: 0.12466370614359172, endAngle: 0.24932741228718344, value: 100},
    target: {index: 0, subindex: 0, startAngle: 5.859194188748811, endAngle: 5.983857894892402, value: 100}}, {
    source: {index: 0, subindex: 0, startAngle: 1.2466370614359172, endAngle: 1.4959644737231006, value: 200},
    target: {index: 0, subindex: 0, startAngle: 4.113902302738527, endAngle: 4.36322971502571, value: 200}}, {
    source: {index: 0, subindex: 0, startAngle: 2.4932741228718345, endAngle: 2.8672652413026096, value: 300},
    target: {index: 0, subindex: 0, startAngle: 5.235875658030852, endAngle: 5.734530482605219, value: 400}}
  ]);
  test.end();
});
