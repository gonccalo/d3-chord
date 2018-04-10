// https://d3js.org/d3-chord/ Version 1.0.0. Copyright 2018 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-path')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-path'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3));
}(this, (function (exports,d3Path) { 'use strict';

var cos = Math.cos;
var sin = Math.sin;
var pi = Math.PI;
var halfPi = pi / 2;
var tau = pi * 2;
var max = Math.max;

var chord = function() {
  var padAngle = 0,
      sortGroups = null;

  function chord(csv, meta) {
      /**
       * meta is an array of objects with name and size
       * csv is an array of objects with origin, target, origin_start, origin_end, target_start, target_end
       * TODO: sort groups?
       */
      var n = csv.length,
          m = meta.length,
          k = 0,
          groups = {},
          chords = [],
          i,
          dx;
      chords.groups = new Array(m);
      for (i = 0; i < m; i++){
          groups[meta[i].name] = {size:meta[i].size, pos: i, startPos: k};
          k += meta[i].size;
      }
      // Convert the sum to scaling factor for [0, 2pi].
      k = max(0, tau - padAngle * m) / k;
      dx = k ? padAngle : tau / n;
      for (i = 0; i < m; i++){
          groups[meta[i].name].startPos = (groups[meta[i].name].startPos * k) + (i * dx);
          chords.groups[i] = {
              index: i,
              startAngle: groups[meta[i].name].startPos,
              endAngle: (groups[meta[i].name].startPos + (groups[meta[i].name].size) * k),
              value: groups[meta[i].name].size
          };
      }

      for (i = 0; i < n; i++){
          var o0 = (csv[i].origin_start * k) + groups[csv[i].origin].startPos,
              o1 = (csv[i].origin_end * k) + groups[csv[i].origin].startPos,
              t0 = (csv[i].target_start * k) + groups[csv[i].target].startPos,
              t1 = (csv[i].target_end * k) + groups[csv[i].target].startPos;
          chords.push({
              source: {
                  index: groups[csv[i].origin].pos,
                  subindex: groups[csv[i].target].pos,
                  startAngle: o0,
                  endAngle: o1,
                  value: csv[i].origin_end - csv[i].origin_start
              },
              target: {
                  index: groups[csv[i].target].pos,
                  subindex: groups[csv[i].origin].pos,
                  startAngle: t0,
                  endAngle: t1,
                  value: csv[i].target_end - csv[i].target_start
              }
          });
      }
      return chords;
  }

  chord.padAngle = function(_) {
    return arguments.length ? (padAngle = max(0, _), chord) : padAngle;
  };

  chord.sortGroups = function(_) {
    return arguments.length ? (sortGroups = _, chord) : sortGroups;
  };

  return chord;
};

var slice = Array.prototype.slice;

var constant = function(x) {
  return function() {
    return x;
  };
};

function defaultSource(d) {
  return d.source;
}

function defaultTarget(d) {
  return d.target;
}

function defaultRadius(d) {
  return d.radius;
}

function defaultStartAngle(d) {
  return d.startAngle;
}

function defaultEndAngle(d) {
  return d.endAngle;
}

var ribbon = function() {
  var source = defaultSource,
      target = defaultTarget,
      radius = defaultRadius,
      startAngle = defaultStartAngle,
      endAngle = defaultEndAngle,
      context = null;

  function ribbon() {
    var buffer,
        argv = slice.call(arguments),
        s = source.apply(this, argv),
        t = target.apply(this, argv),
        sr = +radius.apply(this, (argv[0] = s, argv)),
        sa0 = startAngle.apply(this, argv) - halfPi,
        sa1 = endAngle.apply(this, argv) - halfPi,
        sx0 = sr * cos(sa0),
        sy0 = sr * sin(sa0),
        tr = +radius.apply(this, (argv[0] = t, argv)),
        ta0 = startAngle.apply(this, argv) - halfPi,
        ta1 = endAngle.apply(this, argv) - halfPi;

    if (!context) context = buffer = d3Path.path();

    context.moveTo(sx0, sy0);
    context.arc(0, 0, sr, sa0, sa1);
    if (sa0 !== ta0 || sa1 !== ta1) { // TODO sr !== tr?
      context.quadraticCurveTo(0, 0, tr * cos(ta0), tr * sin(ta0));
      context.arc(0, 0, tr, ta0, ta1);
    }
    context.quadraticCurveTo(0, 0, sx0, sy0);
    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }

  ribbon.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), ribbon) : radius;
  };

  ribbon.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), ribbon) : startAngle;
  };

  ribbon.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), ribbon) : endAngle;
  };

  ribbon.source = function(_) {
    return arguments.length ? (source = _, ribbon) : source;
  };

  ribbon.target = function(_) {
    return arguments.length ? (target = _, ribbon) : target;
  };

  ribbon.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), ribbon) : context;
  };

  return ribbon;
};

exports.chord = chord;
exports.ribbon = ribbon;

Object.defineProperty(exports, '__esModule', { value: true });

})));
