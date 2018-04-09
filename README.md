# d3-chord

Visualize relationships or network flow with an aesthetically-pleasing circular layout.

[<img alt="Chord Diagram" src="https://raw.githubusercontent.com/d3/d3-chord/master/img/chord.png" width="480" height="480">](http://bl.ocks.org/mbostock/4062006)

## Installing

If you use NPM, `npm install d3-chord`. Otherwise, download the [latest release](https://github.com/d3/d3-chord/releases/latest). You can also load directly from [d3js.org](https://d3js.org), either as a [standalone library](https://d3js.org/d3-chord.v1.min.js) or as part of [D3 4.0](https://github.com/d3/d3). AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3` global is exported:

```html
<script src="https://d3js.org/d3-array.v1.min.js"></script>
<script src="https://d3js.org/d3-path.v1.min.js"></script>
<script src="https://d3js.org/d3-chord.v1.min.js"></script>
<script>

var chord = d3.chord();

</script>
```

## API Reference

<a href="#chord" name="chord">#</a> d3.<b>chord</b>() [<>](https://github.com/d3/d3-chord/blob/master/src/chord.js "Source")

Constructs a new chord layout with the default settings.

<a href="#_chord" name="_chord">#</a> <i>chord</i>(<i>object, meta</i>) [<>](https://github.com/d3/d3-chord/blob/master/src/chord.js#L19 "Source")

Computes the chord layout for the specified *object*, where the *object* represents the directed connections between the different groups specified in *meta*. The given *object* must be an array, where each element *object*[*i*] is an object with *origin*, *target*, *origin_start*, *origin_end*, *target_start*, *target_end*, where each *object*.*origin* represents the name of the origin group, *object*.*target* is the name of the target group. *origin_start*, *origin_end* represent the start and end of this connection in the origin node, *target_start*, *target_end* are the start and end of this connection in the target node. The start and end must be contained in size of the node. Example:

```js
var object = [
    {origin: "tig00007144", target: "chr03", origin_start:  113, origin_end:  824, target_start: 332034, target_end: 333111},
    {origin: "tig00026480", target: "chr03", origin_start:  500, origin_end: 1387, target_start: 348621, target_end: 349199},
    {origin: "tig00003221", target: "chr03", origin_start: 2916, origin_end: 3961, target_start: 212786, target_end: 214087},
    {origin: "tig00010111", target: "chr03", origin_start:  218, origin_end:  989, target_start: 230067, target_end: 231135},
    {origin: "tig00000318", target: "chr03", origin_start:    1, origin_end:  244, target_start: 256211, target_end: 296393},
    {origin: "tig00009327", target: "chr03", origin_start:  878, origin_end: 1878, target_start: 141515, target_end: 161602},
    {origin: "tig00025208", target: "chr03", origin_start:  878, origin_end: 2000, target_start: 100069, target_end: 150203},
    {origin: "tig00019172", target: "chr03", origin_start:  720, origin_end: 1583, target_start:   1066, target_end:   9500},
    {origin: "tig00004923", target: "chr03", origin_start: 1154, origin_end: 1849, target_start: 100531, target_end: 161598}
];

var meta = [
    {name: "tig00007144", size: 1000},
    {name: "tig00026480", size: 2000},
    {name: "tig00003221", size: 4000},
    {name: "tig00010111", size: 2000},
    {name: "tig00000318", size: 2000},
    {name: "tig00009327", size: 2000},
    {name: "tig00025208", size: 2000},
    {name: "tig00019172", size: 2000},
    {name: "tig00004923", size: 2000},
    {name: "chr03"      , size: 350204}
]
```

The return value of *chord*(*object*, *meta*) is an array of *chords*, where each chord represents the combined bidirectional flow between two nodes *i* and *j* (where *i* may be equal to *j*) and is an object with the following properties:

* `source` - the source subgroup
* `target` - the target subgroup

Each source and target subgroup is also an object with the following properties:

* `startAngle` - the start angle in radians
* `endAngle` - the end angle in radians
* `value` - the flow value
* `index` - the node index *i*
* `subindex` - the node index *j*

The chords are typically passed to [d3.ribbon](#ribbon) to display the network relationships. The returned array includes only chord objects for which the value *matrix*[*i*][*j*] or *matrix*[*j*][*i*] is non-zero. Furthermore, the returned array only contains unique chords: a given chord *ij* represents the bidirectional flow from *i* to *j* *and* from *j* to *i*, and does not contain a duplicate chord *ji*; *i* and *j* are chosen such that the chord’s source always represents the larger of *matrix*[*i*][*j*] and *matrix*[*j*][*i*]. In other words, *chord*.source.index equals *chord*.target.subindex, *chord*.source.subindex equals *chord*.target.index, *chord*.source.value is greater than or equal to *chord*.target.value, and *chord*.source.value is always greater than zero.

The *chords* array also defines a secondary array of length *n*, *chords*.groups, where each group represents the combined outflow for node *i*, corresponding to the elements *matrix*[*i*][0 … *n* - 1], and is an object with the following properties:

* `startAngle` - the start angle in radians
* `endAngle` - the end angle in radians
* `value` - the total outgoing flow value for node *i*
* `index` - the node index *i*

The groups are typically passed to [d3.arc](https://github.com/d3/d3-shape#arc) to produce a donut chart around the circumference of the chord layout.

<a href="#chord_padAngle" name="#chord_padAngle">#</a> <i>chord</i>.<b>padAngle</b>([<i>angle</i>]) [<>](https://github.com/d3/d3-chord/blob/master/src/chord.js#L104 "Source")

If *angle* is specified, sets the pad angle between adjacent groups to the specified number in radians and returns this chord layout. If *angle* is not specified, returns the current pad angle, which defaults to zero.

<a href="#chord_sortGroups" name="#chord_sortGroups">#</a> <i>chord</i>.<b>sortGroups</b>([<i>compare</i>]) [<>](https://github.com/d3/d3-chord/blob/master/src/chord.js#L108 "Source")

If *compare* is specified, sets the group comparator to the specified function or null and returns this chord layout. If *compare* is not specified, returns the current group comparator, which defaults to null. If the group comparator is non-null, it is used to sort the groups by their total outflow. See also [d3.ascending](https://github.com/d3/d3-array#ascending) and [d3.descending](https://github.com/d3/d3-array#descending).

<a href="#ribbon" name="ribbon">#</a> d3.<b>ribbon</b>() [<>](https://github.com/d3/d3-chord/blob/master/src/ribbon.js "Source")

Creates a new ribbon generator with the default settings.

<a href="#_ribbon" name="_ribbon">#</a> <i>ribbon</i>(<i>arguments…</i>) [<>](https://github.com/d3/d3-chord/blob/master/src/ribbon.js#L34 "Source")

Generates a ribbon for the given *arguments*. The *arguments* are arbitrary; they are simply propagated to the ribbon generator’s accessor functions along with the `this` object. For example, with the default settings, a [chord object](#_chord) expected:

```js
var ribbon = d3.ribbon();

ribbon({
  source: {startAngle: 0.7524114, endAngle: 1.1212972, radius: 240},
  target: {startAngle: 1.8617078, endAngle: 1.9842927, radius: 240}
}); // "M164.0162810494058,-175.21032946354026A240,240,0,0,1,216.1595644740915,-104.28347273835429Q0,0,229.9158815306728,68.8381247563705A240,240,0,0,1,219.77316791012538,96.43523560788266Q0,0,164.0162810494058,-175.21032946354026Z"
```

Or equivalently if the radius is instead defined as a constant:

```js
var ribbon = d3.ribbon()
    .radius(240);

ribbon({
  source: {startAngle: 0.7524114, endAngle: 1.1212972},
  target: {startAngle: 1.8617078, endAngle: 1.9842927}
}); // "M164.0162810494058,-175.21032946354026A240,240,0,0,1,216.1595644740915,-104.28347273835429Q0,0,229.9158815306728,68.8381247563705A240,240,0,0,1,219.77316791012538,96.43523560788266Q0,0,164.0162810494058,-175.21032946354026Z"
```

If the ribbon generator has a context, then the ribbon is rendered to this context as a sequence of path method calls and this function returns void. Otherwise, a path data string is returned.

<a href="#ribbon_source" name="ribbon_source">#</a> <i>ribbon</i>.<b>source</b>([<i>source</i>]) [<>](https://github.com/d3/d3-chord/blob/master/src/ribbon.js#L74 "Source")

If *source* is specified, sets the source accessor to the specified function and returns this ribbon generator. If *source* is not specified, returns the current source accessor, which defaults to:

```js
function source(d) {
  return d.source;
}
```

<a href="#ribbon_target" name="ribbon_target">#</a> <i>ribbon</i>.<b>target</b>([<i>target</i>]) [<>](https://github.com/d3/d3-chord/blob/master/src/ribbon.js#L78 "Source")

If *target* is specified, sets the target accessor to the specified function and returns this ribbon generator. If *target* is not specified, returns the current target accessor, which defaults to:

```js
function target(d) {
  return d.target;
}
```

<a href="#ribbon_radius" name="ribbon_radius">#</a> <i>ribbon</i>.<b>radius</b>([<i>radius</i>]) [<>](https://github.com/d3/d3-chord/blob/master/src/ribbon.js#L62 "Source")

If *radius* is specified, sets the radius accessor to the specified function and returns this ribbon generator. If *radius* is not specified, returns the current radius accessor, which defaults to:

```js
function radius(d) {
  return d.radius;
}
```

<a href="#ribbon_startAngle" name="ribbon_startAngle">#</a> <i>ribbon</i>.<b>startAngle</b>([<i>angle</i>]) [<>](https://github.com/d3/d3-chord/blob/master/src/ribbon.js#L66 "Source")

If *angle* is specified, sets the start angle accessor to the specified function and returns this ribbon generator. If *angle* is not specified, returns the current start angle accessor, which defaults to:

```js
function startAngle(d) {
  return d.startAngle;
}
```

The *angle* is specified in radians, with 0 at -*y* (12 o’clock) and positive angles proceeding clockwise.

<a href="#ribbon_endAngle" name="ribbon_endAngle">#</a> <i>ribbon</i>.<b>endAngle</b>([<i>angle</i>]) [<>](https://github.com/d3/d3-chord/blob/master/src/ribbon.js#L70 "Source")

If *angle* is specified, sets the end angle accessor to the specified function and returns this ribbon generator. If *angle* is not specified, returns the current end angle accessor, which defaults to:

```js
function endAngle(d) {
  return d.endAngle;
}
```

The *angle* is specified in radians, with 0 at -*y* (12 o’clock) and positive angles proceeding clockwise.

<a href="#ribbon_context" name="ribbon_context">#</a> <i>ribbon</i>.<b>context</b>([<i>context</i>]) [<>](https://github.com/d3/d3-chord/blob/master/src/ribbon.js#L82 "Source")

If *context* is specified, sets the context and returns this ribbon generator. If *context* is not specified, returns the current context, which defaults to null. If the context is not null, then the [generated ribbon](#_ribbon) is rendered to this context as a sequence of [path method](http://www.w3.org/TR/2dcontext/#canvaspathmethods) calls. Otherwise, a [path data](http://www.w3.org/TR/SVG/paths.html#PathData) string representing the generated ribbon is returned. See also [d3-path](https://github.com/d3/d3-path).
