import {max, tau} from "./math";

export default function() {
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
}
