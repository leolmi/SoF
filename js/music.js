// Note e intervalli: nomi italiani, alterazioni scritte con # e b.
var Music = (function () {
  var LETTERS = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
  var SEMITONES = [0, 2, 4, 5, 7, 9, 11];

  // steps: distanza in gradi (0 = unisono); semitones: ampiezza.
  var INTERVALS = [
    { name: '2ª minore', steps: 1, semitones: 1 },
    { name: '2ª maggiore', steps: 1, semitones: 2 },
    { name: '2ª aumentata', steps: 1, semitones: 3 },
    { name: '3ª minore', steps: 2, semitones: 3 },
    { name: '3ª maggiore', steps: 2, semitones: 4 },
    { name: '4ª diminuita', steps: 3, semitones: 4 },
    { name: '4ª giusta', steps: 3, semitones: 5 },
    { name: '4ª aumentata', steps: 3, semitones: 6 },
    { name: '5ª diminuita', steps: 4, semitones: 6 },
    { name: '5ª giusta', steps: 4, semitones: 7 },
    { name: '5ª aumentata', steps: 4, semitones: 8 },
    { name: '6ª minore', steps: 5, semitones: 8 },
    { name: '6ª maggiore', steps: 5, semitones: 9 },
    { name: '6ª aumentata', steps: 5, semitones: 10 },
    { name: '7ª diminuita', steps: 6, semitones: 9 },
    { name: '7ª minore', steps: 6, semitones: 10 },
    { name: '7ª maggiore', steps: 6, semitones: 11 },
    { name: '8ª giusta', steps: 7, semitones: 12 }
  ];

  function interval(name) {
    return INTERVALS.find(function (i) { return i.name === name; });
  }

  // 'Fa#' -> { letter: 3, accidental: 1 }
  function parse(note) {
    var m = /^(Do|Re|Mi|Fa|Sol|La|Si)(#|b)?$/.exec(note);
    return { letter: LETTERS.indexOf(m[1]), accidental: m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0 };
  }

  function pitchClass(note) {
    var p = parse(note);
    return (SEMITONES[p.letter] + p.accidental + 12) % 12;
  }

  // Nota a distanza `iv` sopra `note`; null se servirebbe una doppia alterazione.
  function transpose(note, iv) {
    var p = parse(note);
    var letter = (p.letter + iv.steps) % 7;
    var target = (pitchClass(note) + iv.semitones) % 12;
    var accidental = ((target - SEMITONES[letter]) % 12 + 18) % 12 - 6;
    if (Math.abs(accidental) > 1) return null;
    return LETTERS[letter] + (accidental === 1 ? '#' : accidental === -1 ? 'b' : '');
  }

  // Nomi della classe di altezza: uno per le note naturali, diesis e bemolle per le altre.
  var NAMES = [['Do'], ['Do#', 'Reb'], ['Re'], ['Re#', 'Mib'], ['Mi'], ['Fa'],
    ['Fa#', 'Solb'], ['Sol'], ['Sol#', 'Lab'], ['La'], ['La#', 'Sib'], ['Si']];

  function namesOf(pc) {
    return NAMES[pc];
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  return {
    LETTERS: LETTERS,
    INTERVALS: INTERVALS,
    interval: interval,
    pitchClass: pitchClass,
    transpose: transpose,
    namesOf: namesOf,
    pick: pick
  };
})();
