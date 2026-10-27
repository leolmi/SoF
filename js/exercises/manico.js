// Esercizio: le note sul manico, dalla nota al tasto e dal tasto alla nota (tasti 0-12).
(function () {
  var LAST_FRET = 12;
  var NOTES = [].concat.apply([], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(Music.namesOf));

  function stringText(string) {
    return 'corda ' + string + ' (' + Guitar.OPEN_NAMES[string] + ')';
  }

  function board(string, frets) {
    return Guitar.svg({
      start: 0,
      end: LAST_FRET,
      wide: true,
      strings: [string],
      dots: frets.map(function (f) { return { string: string, fret: f, root: true }; })
    });
  }

  function findFret() {
    var string = Music.pick([1, 2, 3, 4, 5, 6]);
    var note = Music.pick(NOTES);
    var fret = Guitar.fretOf(note, string);
    var frets = fret + 12 <= LAST_FRET ? [fret, fret + 12] : [fret];
    return {
      key: note + string,
      question: 'Dov\'è il ' + note + ' sulla ' + stringText(string) + '?',
      answer: '<div class="big">Tasto ' + frets.join(' e ') + '</div>' + board(string, frets)
    };
  }

  function findNote() {
    var string = Music.pick([1, 2, 3, 4, 5, 6]);
    var fret = Math.floor(Math.random() * (LAST_FRET + 1));
    var names = Music.namesOf((Guitar.OPEN[string] + fret) % 12);
    return {
      key: string + '/' + fret,
      question: 'Che nota è la ' + stringText(string) + ' al tasto ' + fret + '?',
      answer: '<div class="big">' + names.join(' / ') + '</div>' + board(string, [fret])
    };
  }

  var last = null;

  SoF.flashcard({
    id: 'manico',
    title: 'Note sul manico',
    next: function () {
      var q;
      do { q = Math.random() < 0.5 ? findFret() : findNote(); }
      while (last && q.key === last.key);
      last = q;
      return q;
    }
  });
})();
