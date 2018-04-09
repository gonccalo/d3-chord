import {range} from "d3-array";
import {max, tau} from "./math";

function compareValue(compare) {
  return function(a, b) {
    return compare(
      a.source.value + a.target.value,
      b.source.value + b.target.value
    );
  };
}

function find_next_min(m, last){
    let j,
        p,
        min = Number.MAX_VALUE,
        min_pair = [];
    for (j = 0; j < m.length; j++){
        for (p = 0; p < m[j].length; p++){
            if(m[j][p][0] >= last[1] && m[j][p][0] < min){
                min_pair = m[j][p];
                min = m[j][p][0];
            }
        }
    }
    return min_pair;
}

function from_object(obj, meta) {
    /**
     * Generate data matrix from an array of dictionaries with:
     *  origin, target, origin_start, origin_end, target_start, target_end
     */
    let n = obj.length,
        group_idx = 0,
        m = [],
        groups = {},
        i,
        j;
    for (i=0; i < n; ++i){
        if (!(obj[i].origin in groups)){
            groups[obj[i].origin] = group_idx++;
            m.forEach(function (elem) {
                elem.push([]);
            });
            let newgroup = [];
            for(j = 0; j < group_idx; j++)
                newgroup.push([]);
            m.push(newgroup);
        }
        if (!(obj[i].target in groups)){
            groups[obj[i].target] = group_idx++;
            m.forEach(function (elem) {
                elem.push([]);
            });
            let newgroup = [];
            for(j = 0; j < group_idx; j++)
                newgroup.push([]);
            m.push(newgroup);
        }
        let origin_idx = groups[obj[i].origin],
            target_idx = groups[obj[i].target];
        m[origin_idx][target_idx].push([obj[i].origin_start, obj[i].origin_end]);
        if (obj[i].origin !== obj[i].target)
            m[target_idx][origin_idx].push([obj[i].target_start, obj[i].target_end]);
    }
    let groupsums = [],
        groupsmax = [],
        empty = [],
        sum = 0,
        max = -1,
        p,
        di;
    for (i = 0; i < m.length; ++i){
        if (m[i][i].length < 1){
            let min = [0,0],
                last_min = [0,0];
            while (true){
                min = find_next_min(m[i], last_min);
                if(min.length < 1)
                    break;
                if(last_min[1] !== min[0]){
                    m[i][i].push([last_min[1], min[0]]);
                }
                last_min = min;
            }
        }
        for (j = 0; j < m[i].length; ++j){
            if (m[i][j].length < 1) {
                i === j ? empty.push(i) : m[i][j].push([0, 0]);
                continue;
            }
            for(p = 0; p < m[i][j].length; ++p){
                sum += m[i][j][p][1] - m[i][j][p][0];
                if (m[i][j][p][1] > max)
                    max = m[i][j][p][1];
            }
        }
        groupsmax.push(max);
        groupsums.push(sum);
        sum = 0;
        max = -1;
    }
    return m;
}

export default function() {
  var padAngle = 0,
      sortGroups = null,
      sortSubgroups = null,
      sortChords = null;

  function chord(csv, meta) {
      /**
       * meta is an array of objects with name and size
       * csv is an array of objects with origin, target, origin_start, origin_end, target_start, target_end
       */
      let n = csv.length,
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
          let o0 = (csv[i].origin_start * k) + groups[csv[i].origin].startPos,
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

  chord.sortSubgroups = function(_) {
    return arguments.length ? (sortSubgroups = _, chord) : sortSubgroups;
  };

  chord.sortChords = function(_) {
    return arguments.length ? (_ == null ? sortChords = null : (sortChords = compareValue(_))._ = _, chord) : sortChords && sortChords._;
  };

  return chord;
}
