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

export function from_object(obj) {
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
    return m;
}

export default function() {
  var padAngle = 0,
      sortGroups = null,
      sortSubgroups = null,
      sortChords = null;

  function chord(matrix) {
    let n = matrix.length,
        groupSums = [],
        chords = [],
        groups = chords.groups = new Array(n),
        subgroups = [],
        k,
        x,
        x0,
        dx,
        i,
        j,
        p;

    // Compute the sum.
    k = 0, i = -1; while (++i < n) {
      x = 0, j = -1; while (++j < n) {
        for (p = 0; p < matrix[i][j].length; ++p)
          x += matrix[i][j][p][1] - matrix[i][j][p][0];
      }
      groupSums.push(x);
      k += x;
    }

    // Convert the sum to scaling factor for [0, 2pi].
    k = max(0, tau - padAngle * n) / k;
    dx = k ? padAngle : tau / n;

    // Compute the start and end angle for each group and subgroup.
    // Note: Opera has a bug reordering object literal properties!
    x = 0;
    i = -1;
    while (++i < n) {
      x0 = x;
      j = -1;
      while (++j < n) {
        let subsubgroups = [];
        for(p = 0; p < matrix[i][j].length; ++p){
          let a0 = (matrix[i][j][p][0] * k) + x0,
          a1 = (matrix[i][j][p][1] * k) + x0,
          v = matrix[i][j][p][1] - matrix[i][j][p][0];
          x += v * k;
          subsubgroups.push({
            index: i,
            subindex: j,
            startAngle: a0,
            endAngle: a1,
            value: v
          });
        }
        subgroups.push(subsubgroups);
      }
      groups[i] = {
        index: i,
        startAngle: x0,
        endAngle: x,
        value: groupSums[i]
      };
      x += dx;
    }

    // Generate chords for each (non-empty) subgroup-subgroup link.
    i = -1;
    while (++i < n) {
      j = i - 1;
      while (++j < n) {
        for(p = 0; p < subgroups[j * n + i].length; ++p){
          let source = subgroups[j * n + i][p],
              target = subgroups[i * n + j][p];
          if (source.value || target.value) {
            chords.push({source: source, target: target});
          }
        }
      }
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
