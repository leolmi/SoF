// Esercizio: comporre una triade e trovarla sulla chitarra in uno string-set, nei tre rivolti.
(function () {
  var ROOTS = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si', 'Sib', 'Mib', 'Lab', 'Reb', 'Fa#', 'Do#'];
  var TYPES = [
    { name: 'maggiore', third: '3ª maggiore', fifth: '5ª giusta' },
    { name: 'minore', third: '3ª minore', fifth: '5ª giusta' },
    { name: 'diminuita', third: '3ª minore', fifth: '5ª diminuita' },
    { name: 'aumentata', third: '3ª maggiore', fifth: '5ª aumentata' }
  ];

  function randomTriad() {
    for (;;) {
      var root = Music.pick(ROOTS);
      var type = Music.pick(TYPES);
      var third = Music.transpose(root, Music.interval(type.third));
      var fifth = Music.transpose(root, Music.interval(type.fifth));
      if (third && fifth) return { root: root, type: type, notes: [root, third, fifth] };
    }
  }

  // Rivolto: quale grado (0 = fondamentale, 1 = 3ª, 2 = 5ª) sta sulla corda più grave.
  var INVERSIONS = [
    { name: 'stato fondamentale', bass: 0 },
    { name: '1° rivolto', bass: 1 },
    { name: '2° rivolto', bass: 2 }
  ];
  var DEGREES = ['1', '3', '5'];

  // Tasti delle note (in ordine dal basso) sulle tre corde del set, in posizione stretta.
  function voicing(notes, set) {
    var bassFret = Guitar.fretOf(notes[0], set[0]);
    var frets = notes.map(function (note, i) {
      var fret = Guitar.fretOf(note, set[i]);
      while (fret - bassFret > 6) fret -= 12;
      while (bassFret - fret > 6) fret += 12;
      return fret;
    });
    if (Math.min.apply(null, frets) < 0) frets = frets.map(function (f) { return f + 12; });
    return frets;
  }

  var last = null;

  SoF.flashcard({
    id: 'triadi',
    title: 'Triadi',
    options: [
      { id: 'inversion1', label: 'Includi 1° rivolto', value: false },
      { id: 'inversion2', label: 'Includi 2° rivolto', value: false }
    ],
    next: function (values) {
      var t;
      do { t = randomTriad(); }
      while (last && t.root === last.root && t.type === last.type);
      last = t;

      var setIndex = Math.floor(Math.random() * Guitar.SETS.length);
      var set = Guitar.SETS[setIndex];
      var inversion = Music.pick(INVERSIONS.filter(function (inv) {
        return inv.bass === 0 || values['inversion' + inv.bass];
      }));
      // Gradi dal basso verso l'acuto, es. 1° rivolto: 3ª, 5ª, fondamentale.
      var order = [0, 1, 2].map(function (i) { return (inversion.bass + i) % 3; });
      var notes = order.map(function (d) { return t.notes[d]; });
      var frets = voicing(notes, set);
      var positions = notes.map(function (note, i) {
        return note + ' (corda ' + set[i] + ', tasto ' + frets[i] + ')';
      }).join(' &middot; ');
      var dots = order.map(function (d, i) {
        return { string: set[i], fret: frets[i], label: DEGREES[d], root: d === 0 };
      });

      return {
        stages: [
          {
            question: 'Triade di ' + t.root + ' ' + t.type.name + ': quali note?',
            answer: '<div class="big">' + t.notes.join(' ') + '</div>' +
              '<div class="notes">' + t.type.third + ' + ' + t.type.fifth + '</div>'
          },
          {
            question: 'Suonala sullo string-set ' + Guitar.SET_NAMES[setIndex] + ' in ' + inversion.name,
            answer: Guitar.svg({ strings: set, dots: dots }) + '<div class="notes">' + positions + '</div>'
          }
        ]
      };
    }
  });
})();
