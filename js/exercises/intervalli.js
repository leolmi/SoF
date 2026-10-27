// Esercizio: trovare la nota a un intervallo dato, o riconoscere l'intervallo tra due note.
(function () {
  var STARTS = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si', 'Sib', 'Mib', 'Lab', 'Reb', 'Fa#', 'Do#'];

  function randomQuestion() {
    for (;;) {
      var start = Music.pick(STARTS);
      var iv = Music.pick(Music.INTERVALS);
      var target = Music.transpose(start, iv);
      if (target) return { type: Music.pick(['find', 'name']), start: start, iv: iv, target: target };
    }
  }

  function semitonesText(iv) {
    return iv.semitones + (iv.semitones === 1 ? ' semitono' : ' semitoni');
  }

  // Corde da cui parte la diteggiatura: dalle corde 2 e 1 non c'è spazio per l'ottava.
  var FINGERING_STRINGS = [6, 5, 4, 3];

  // Prima nota sulla corda, seconda nella posizione della scala che sale sulle corde successive.
  function fingeringStage(q) {
    var string = Music.pick(FINGERING_STRINGS);
    var positions = Guitar.scaleFingering([q.start, q.target], string);
    var dots = positions.map(function (p, i) {
      return { string: p.string, fret: p.fret, label: i === 0 ? '1' : '2', root: i === 0 };
    });
    var text = [q.start, q.target].map(function (note, i) {
      return note + ' (corda ' + positions[i].string + ', tasto ' + positions[i].fret + ')';
    }).join(' &rarr; ');
    return {
      question: 'Suona l\'intervallo partendo da ' + q.start + ' sulla corda ' + string +
        ' (' + Guitar.OPEN_NAMES[string] + ')',
      answer: Guitar.svg({ dots: dots, strings: [string] }) + '<div class="notes">' + text + '</div>'
    };
  }

  var last = null;

  SoF.flashcard({
    id: 'intervalli',
    title: 'Intervalli',
    options: [{ id: 'fingering', label: 'Diteggiature', value: false }],
    next: function (values) {
      var q;
      do { q = randomQuestion(); }
      while (last && q.start === last.start && q.iv === last.iv);
      last = q;

      var first;
      if (q.type === 'find') {
        first = {
          question: 'Da ' + q.start + ', sali di una ' + q.iv.name,
          answer: '<div class="big">' + q.target + '</div>' +
            '<div class="notes">' + q.start + ' &rarr; ' + q.target + ' (' + semitonesText(q.iv) + ')</div>'
        };
      } else {
        first = {
          question: q.start + ' → ' + q.target + ': che intervallo è?',
          answer: '<div class="big">' + q.iv.name + '</div>' +
            '<div class="notes">' + semitonesText(q.iv) + '</div>'
        };
      }
      var stages = [first];
      if (values.fingering) stages.push(fingeringStage(q));
      return { stages: stages };
    }
  });
})();
