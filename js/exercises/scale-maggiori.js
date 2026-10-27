// Esercizi: scale maggiori con le alterazioni in chiave (circolo delle quinte e delle quarte).
(function () {
  var LETTERS = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
  // Quante domande sulle note entrano in ogni giro (peso minore).
  var NOTES_PER_ROUND = 3;

  // cfg.keys: sequenza delle tonalità, ogni passo aggiunge un'alterazione.
  // cfg.order: ordine delle alterazioni in chiave.
  function createExercise(cfg) {
    function accidentalsOf(count) {
      return cfg.order.slice(0, count).map(function (n) { return n + cfg.symbol; });
    }

    function scaleOf(count) {
      var altered = cfg.order.slice(0, count);
      var key = cfg.keys[count];
      var tonic = LETTERS.indexOf(key) >= 0 ? key : key.slice(0, -cfg.symbol.length);
      var start = LETTERS.indexOf(tonic);
      var notes = [];
      for (var i = 0; i <= 7; i++) {
        var letter = LETTERS[(start + i) % 7];
        notes.push(altered.indexOf(letter) >= 0 ? letter + cfg.symbol : letter);
      }
      return notes;
    }

    function accidentalsText(count) {
      if (count === 0) return 'nessuna alterazione';
      return count + ' ' + (count === 1 ? cfg.singular : cfg.plural) + ': ' + accidentalsOf(count).join(' ');
    }

    function buildRound() {
      var round = [];
      cfg.keys.forEach(function (_, count) {
        round.push({ type: 'byCount', count: count });
        round.push({ type: 'byKey', count: count });
      });
      SoF.shuffle(cfg.keys.map(function (_, count) { return count; }))
        .slice(0, NOTES_PER_ROUND)
        .forEach(function (count) { round.push({ type: 'notes', count: count }); });
      return SoF.shuffle(round);
    }

    function questionText(q) {
      var key = cfg.keys[q.count];
      switch (q.type) {
        case 'byCount':
          return q.count === 0
            ? 'Dimmi la scala maggiore senza alterazioni in chiave'
            : 'Dimmi la scala maggiore con ' + q.count + ' ' + (q.count === 1 ? cfg.singular : cfg.plural) + ' in chiave';
        case 'byKey':
          return 'Tonalità di ' + key + ' maggiore: quanti e quali ' + cfg.plural + ' in chiave?';
        case 'notes':
          return 'Dimmi le note della scala di ' + key + ' maggiore';
      }
    }

    function answerHtml(q) {
      var key = cfg.keys[q.count];
      var main = q.type === 'byCount'
        ? '<div class="big">' + key + ' maggiore</div><div>' + accidentalsText(q.count) + '</div>'
        : q.type === 'byKey'
          ? '<div class="big">' + accidentalsText(q.count) + '</div>'
          : '<div class="big">' + scaleOf(q.count).join(' ') + '</div><div>' + accidentalsText(q.count) + '</div>';
      var notes = q.type === 'notes' ? '' : '<div class="notes">' + scaleOf(q.count).join(' ') + '</div>';
      var circle = cfg.keys.map(function (k, i) {
        return '<span class="' + (i === q.count ? 'on' : '') + '">' + k + '</span>';
      }).join('');
      return main + notes + '<div class="circle">' + circle + '</div>';
    }

    // Corde da cui parte la diteggiatura: dalle corde 2 e 1 non c'è spazio per l'ottava.
    var FINGERING_STRINGS = [6, 5, 4, 3];
    var DEGREES = ['1', '2', '3', '4', '5', '6', '7', '1'];

    function fingeringStage(count) {
      var string = Music.pick(FINGERING_STRINGS);
      var notes = scaleOf(count);
      var dots = Guitar.scaleFingering(notes, string).map(function (p, i) {
        return { string: p.string, fret: p.fret, label: DEGREES[i], root: DEGREES[i] === '1' };
      });
      return {
        question: 'Suona la scala di ' + cfg.keys[count] + ' maggiore partendo dalla tonica sulla corda ' +
          string + ' (' + Guitar.OPEN_NAMES[string] + ')',
        answer: Guitar.svg({ dots: dots, strings: [string] })
      };
    }

    var round = [];
    var last = null;

    SoF.flashcard({
      id: cfg.id,
      title: cfg.title,
      options: [{ id: 'fingering', label: 'Diteggiature', value: false }],
      reset: function () { round = []; },
      next: function (values) {
        if (round.length === 0) {
          round = buildRound();
          // Evita la stessa tonalità due volte di fila a cavallo dei giri.
          if (last && round[round.length - 1].count === last.count) {
            round.unshift(round.pop());
          }
        }
        last = round.pop();
        var stages = [{ question: questionText(last), answer: answerHtml(last) }];
        if (values.fingering) stages.push(fingeringStage(last.count));
        return { stages: stages };
      }
    });
  }

  createExercise({
    id: 'scale-diesis',
    title: 'Scale maggiori con i diesis',
    keys: ['Do', 'Sol', 'Re', 'La', 'Mi', 'Si', 'Fa#', 'Do#'],
    order: ['Fa', 'Do', 'Sol', 'Re', 'La', 'Mi', 'Si'],
    symbol: '#',
    singular: 'diesis',
    plural: 'diesis'
  });

  createExercise({
    id: 'scale-bemolli',
    title: 'Scale maggiori con i bemolli',
    keys: ['Do', 'Fa', 'Sib', 'Mib', 'Lab', 'Reb', 'Solb', 'Dob'],
    order: ['Si', 'Mi', 'La', 'Re', 'Sol', 'Do', 'Fa'],
    symbol: 'b',
    singular: 'bemolle',
    plural: 'bemolli'
  });
})();
