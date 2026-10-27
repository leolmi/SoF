// Esercizio: continuare il circolo delle quarte da una nota per N note, e, come opzione, suonarlo su una corda.
(function () {
  // Il passaggio enarmonico Solb = Fa# chiude il circolo tornando ai nomi naturali.
  var CIRCLE = ['Do', 'Fa', 'Sib', 'Mib', 'Lab', 'Reb', 'Solb/Fa#', 'Si', 'Mi', 'La', 'Re', 'Sol'];
  var MIN_STEPS = 3;
  var MAX_STEPS = 6;

  function randomSteps() {
    return MIN_STEPS + Math.floor(Math.random() * (MAX_STEPS - MIN_STEPS + 1));
  }

  function answerHtml(start, steps) {
    var notes = [];
    for (var i = 1; i <= steps; i++) notes.push(CIRCLE[(start + i) % 12]);
    var circle = CIRCLE.map(function (n, i) {
      var offset = (i - start + 12) % 12;
      var cls = offset === 0 ? 'start' : offset <= steps ? 'on' : '';
      return '<span class="' + cls + '">' + n + '</span>';
    }).join('');
    return '<div class="big">' + notes.join(' &rarr; ') + '</div>' +
      '<div class="circle">' + circle + '</div>';
  }

  // Note della sequenza numerate dalla partenza (1, pallino evidenziato), sulla corda.
  function stringHtml(start, steps, string) {
    var dots = [];
    var positions = [];
    for (var i = 0; i <= steps; i++) {
      var name = CIRCLE[(start + i) % 12];
      var fret = Guitar.fretOf(name.split('/')[0], string);
      dots.push({ string: string, fret: fret, label: String(i + 1), root: i === 0 });
      positions.push(name + ' (tasto ' + fret + ')');
    }
    return Guitar.svg({ start: 0, end: 12, wide: true, strings: [string], dots: dots }) +
      '<div class="notes">' + positions.join(' &rarr; ') + '</div>';
  }

  var round = [];
  var last = null;

  SoF.flashcard({
    id: 'circolo-quarte',
    title: 'Circolo delle quarte',
    options: [{ id: 'fretboard', label: 'Sequenza sul manico', value: false }],
    reset: function () { round = []; },
    next: function (values) {
      if (round.length === 0) {
        round = SoF.shuffle(CIRCLE.map(function (_, i) { return i; }));
        // Evita la stessa nota di partenza due volte di fila a cavallo dei giri.
        if (round[round.length - 1] === last) round.unshift(round.pop());
      }
      last = round.pop();
      var steps = randomSteps();
      var stages = [{
        question: 'Circolo delle quarte: parti da ' + CIRCLE[last] + ' e continua per ' + steps + ' note',
        answer: answerHtml(last, steps)
      }];
      if (values.fretboard) {
        var string = Music.pick([1, 2, 3, 4, 5, 6]);
        stages.push({
          question: 'Suona la sequenza sulla corda ' + string + ' (' + Guitar.OPEN_NAMES[string] + ')',
          answer: stringHtml(last, steps, string)
        });
      }
      return { stages: stages };
    }
  });
})();
