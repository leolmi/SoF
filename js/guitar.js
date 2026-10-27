// Chitarra in accordatura standard: corde, string-set e disegno del manico.
var Guitar = (function () {
  // Classe di altezza della corda a vuoto (corda 6 = Mi basso).
  var OPEN = { 6: 4, 5: 9, 4: 2, 3: 7, 2: 11, 1: 4 };
  // Altezza assoluta della corda a vuoto in semitoni (MIDI).
  var OPEN_PITCH = { 6: 40, 5: 45, 4: 50, 3: 55, 2: 59, 1: 64 };
  var OPEN_NAMES ={ 6: 'Mi', 5: 'La', 4: 'Re', 3: 'Sol', 2: 'Si', 1: 'Mi' };
  // String-set dalla corda più grave alla più acuta.
  var SETS = [[6, 5, 4], [5, 4, 3], [4, 3, 2], [3, 2, 1]];
  var SET_NAMES = ['I', 'II', 'III', 'IV'];

  // Tasto più basso (0-11) della nota sulla corda.
  function fretOf(note, string) {
    return (Music.pitchClass(note) - OPEN[string] + 12) % 12;
  }

  // Diteggiatura in posizione (un dito per tasto) delle note dalla tonica su `string` in su:
  // si resta sulla corda finché la nota cade nella posizione, poi si passa alla corda più acuta.
  // Ogni nota è più acuta della precedente.
  function scaleFingering(notes, string) {
    var rootFret = fretOf(notes[0], string);
    var lo = Math.max(0, rootFret - 1);
    var hi = lo + 4;
    var previous = -1;

    // Tasto della nota sulla corda, a partire da `lo` e sopra la nota precedente.
    function place(note, s) {
      var fret = fretOf(note, s);
      if (fret < lo) fret += 12;
      while (OPEN_PITCH[s] + fret <= previous) fret += 12;
      return fret;
    }

    return notes.map(function (note) {
      var fret = place(note, string);
      while (fret > hi && string > 1) {
        string--;
        fret = place(note, string);
      }
      previous = OPEN_PITCH[string] + fret;
      return { string: string, fret: fret };
    });
  }

  // opts.dots: [{ string, fret, label, root }]; opts.strings: corde evidenziate;
  // opts.start/opts.end: tasti mostrati (altrimenti attorno ai pallini); opts.wide: manico lungo.
  function svg(opts) {
    var frets = opts.dots.map(function (d) { return d.fret; });
    var lo = Math.min.apply(null, frets);
    var hi = Math.max.apply(null, frets);
    var start = opts.start !== undefined ? opts.start : lo === 0 ? 0 : Math.max(1, lo - 1);
    var end = opts.end !== undefined ? opts.end : Math.max(start + 4, hi + 1);
    var strings = opts.strings || [];
    var cols = end - start + 1;
    var w = opts.wide ? 52 : 70, gap = 30, left = 28, top = 20;
    var width = left * 2 + cols * w;
    var height = top + 5 * gap + 40;

    function x(fret) { return left + (fret - start + 0.5) * w; }
    function y(string) { return top + (string - 1) * gap; }

    var out = '<svg class="fretboard' + (opts.wide ? ' wide' : '') + '" viewBox="0 0 ' + width + ' ' + height + '">';
    for (var c = 0; c <= cols; c++) {
      if (start === 0 && c === 0) continue;
      var fx = left + c * w;
      var isNut = start === 0 && c === 1;
      out += '<line class="' + (isNut ? 'nut' : 'fret') + '" x1="' + fx + '" y1="' + y(1) + '" x2="' + fx + '" y2="' + y(6) + '"/>';
    }
    for (var s = 1; s <= 6; s++) {
      var x1 = start === 0 ? left + w : left;
      out += '<line class="string' + (strings.indexOf(s) >= 0 ? ' in-set' : '') + '" x1="' + x1 + '" y1="' + y(s) + '" x2="' + (left + cols * w) + '" y2="' + y(s) + '"/>';
      out += '<text class="string-label" x="' + (left - 12) + '" y="' + (y(s) + 4) + '">' + s + '</text>';
    }
    for (var f = start; f <= end; f++) {
      out += '<text class="fret-label" x="' + x(f) + '" y="' + (y(6) + 28) + '">' + f + '</text>';
    }
    opts.dots.forEach(function (d) {
      out += '<circle class="dot' + (d.root ? ' root' : '') + '" cx="' + x(d.fret) + '" cy="' + y(d.string) + '" r="13"/>';
      if (d.label) out += '<text class="dot-label" x="' + x(d.fret) + '" y="' + (y(d.string) + 4) + '">' + d.label + '</text>';
    });
    return out + '</svg>';
  }

  return {
    OPEN: OPEN,
    OPEN_NAMES: OPEN_NAMES,
    SETS: SETS,
    SET_NAMES: SET_NAMES,
    fretOf: fretOf,
    scaleFingering: scaleFingering,
    svg: svg
  };
})();
