// Registro degli esercizi e navigazione della sidebar.
var SoF = (function () {
  var exercises = [];
  var current = null;

  // exercise.options: [{ id, label, value }] spunte mostrate nella toolbar in basso;
  // i valori correnti stanno in exercise.values e restano salvati nel browser.
  function register(exercise) {
    exercise.values = loadValues(exercise);
    exercises.push(exercise);
  }

  function loadValues(exercise) {
    var values = {};
    (exercise.options || []).forEach(function (o) { values[o.id] = o.value; });
    try {
      var saved = JSON.parse(localStorage.getItem('sof:' + exercise.id) || '{}');
      Object.keys(values).forEach(function (k) {
        if (typeof saved[k] === 'boolean') values[k] = saved[k];
      });
    } catch (e) { /* storage non disponibile: valori predefiniti */ }
    return values;
  }

  function saveValues(exercise) {
    try {
      localStorage.setItem('sof:' + exercise.id, JSON.stringify(exercise.values));
    } catch (e) { /* storage non disponibile */ }
  }

  var CHECK_ICON = '<svg class="check" viewBox="0 0 16 16" aria-hidden="true">' +
    '<path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2.2" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function renderToolbar(exercise) {
    var toolbar = document.getElementById('toolbar');
    var options = exercise.options || [];
    toolbar.innerHTML = '';
    toolbar.hidden = options.length === 0;
    options.forEach(function (o) {
      var label = document.createElement('label');
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = exercise.values[o.id];
      label.className = 'toggle' + (input.checked ? ' on' : '');
      input.addEventListener('change', function () {
        exercise.values[o.id] = input.checked;
        label.classList.toggle('on', input.checked);
        saveValues(exercise);
        // Toglie il focus così lo spazio torna a far avanzare l'esercizio.
        input.blur();
        if (exercise.onOptionsChange) exercise.onOptionsChange();
      });
      label.appendChild(input);
      label.insertAdjacentHTML('beforeend', CHECK_ICON);
      label.appendChild(document.createTextNode(o.label));
      toolbar.appendChild(label);
    });
  }

  function open(id) {
    var exercise = exercises.find(function (e) { return e.id === id; }) || exercises[0];
    if (current && current.unmount) current.unmount();
    current = exercise;

    document.querySelectorAll('#menu a').forEach(function (a) {
      a.classList.toggle('active', a.dataset.id === exercise.id);
    });

    var content = document.getElementById('content');
    content.innerHTML = '';
    renderToolbar(exercise);
    exercise.mount(content);
  }

  function start() {
    var menu = document.getElementById('menu');
    exercises.forEach(function (e) {
      var a = document.createElement('a');
      a.href = '#' + e.id;
      a.dataset.id = e.id;
      a.textContent = e.title;
      menu.appendChild(a);
    });

    window.addEventListener('hashchange', function () { open(location.hash.slice(1)); });
    open(location.hash.slice(1));
  }

  function shuffle(list) {
    for (var i = list.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = list[i]; list[i] = list[j]; list[j] = t;
    }
    return list;
  }

  // Esercizio a domanda/risposta: spazio (o clic) mostra la soluzione, poi la domanda successiva.
  // cfg.reset(): riparte da capo; cfg.next(values): { question: testo, answer: html }
  // oppure { stages: [{ question, answer }, ...] } per domande in più fasi;
  // cfg.options: spunte della toolbar, i cui valori arrivano a next().
  function flashcard(cfg) {
    var els = null;
    var stages = [];
    var index = 0;
    var revealed = false;

    function showStage() {
      var stage = document.createElement('div');
      stage.className = 'stage';
      stage.innerHTML = '<div class="question"></div><div class="answer" hidden></div>';
      stage.querySelector('.question').textContent = stages[index].question;
      stage.querySelector('.answer').innerHTML = stages[index].answer;
      els.stages.appendChild(stage);
      revealed = false;
      els.hint.textContent = 'Spazio per la soluzione';
    }

    function nextQuestion() {
      var q = cfg.next(exercise.values);
      stages = q.stages || [q];
      index = 0;
      els.stages.innerHTML = '';
      showStage();
    }

    // Mostrata una risposta intermedia, la fase successiva parte subito.
    function step() {
      if (revealed) return nextQuestion();
      els.stages.lastChild.querySelector('.answer').hidden = false;
      if (++index < stages.length) return showStage();
      revealed = true;
      els.hint.textContent = 'Spazio per la prossima domanda';
    }

    function onKey(e) {
      if (e.code !== 'Space') return;
      e.preventDefault();
      step();
    }

    var exercise = {
      id: cfg.id,
      title: cfg.title,
      options: cfg.options,
      onOptionsChange: function () {
        if (cfg.reset) cfg.reset();
        nextQuestion();
      },
      mount: function (root) {
        root.innerHTML =
          '<div class="card">' +
          '<div class="stages"></div>' +
          '<div class="hint"></div>' +
          '</div>';
        var card = root.querySelector('.card');
        els = {
          stages: card.querySelector('.stages'),
          hint: card.querySelector('.hint')
        };
        card.addEventListener('click', step);
        document.addEventListener('keydown', onKey);
        if (cfg.reset) cfg.reset();
        nextQuestion();
      },
      unmount: function () {
        document.removeEventListener('keydown', onKey);
      }
    };
    register(exercise);
  }

  return { register: register, start: start, shuffle: shuffle, flashcard: flashcard };
})();
