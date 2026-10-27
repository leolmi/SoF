# School of Music

Esercizi per imparare la teoria musicale e il manico della chitarra: scale, circolo delle
quarte, intervalli, triadi e note sul manico. Funziona offline, senza installare nulla.

## Come usarlo

1. **Scarica il file** [SoF.html](https://github.com/<utente>/SoF/releases/latest/download/SoF.html)
   (è sempre l'ultima versione).
2. **Aprilo con doppio clic**: si apre nel browser, anche senza connessione a internet.
3. **Scegli un esercizio** dal menu a sinistra.
4. **Premi la barra spaziatrice** (o tocca la scheda):
   - la prima volta vedi la soluzione;
   - la volta successiva passi alla domanda seguente.

La versione che hai è scritta in fondo al menu (es. `v1.2`). Per sapere se ce n'è una
più recente guarda la [pagina delle versioni](https://github.com/<utente>/SoF/releases);
per aggiornare basta scaricare di nuovo il file dallo stesso link.

## Gli esercizi

| Esercizio | Cosa chiede |
|---|---|
| Scale maggiori con i diesis | Tonalità e diesis in chiave (Do-Sol-Re-La-Mi-Si-Fa#-Do#) |
| Scale maggiori con i bemolli | Tonalità e bemolli in chiave (Do-Fa-Sib-Mib-Lab-Reb-Solb-Dob) |
| Circolo delle quarte | Continuare il circolo da una nota per alcune note |
| Intervalli | Trovare la nota a un intervallo, o riconoscere l'intervallo tra due note |
| Triadi | Le note di una triade e la sua posizione sulla chitarra in uno string-set |
| Note sul manico | Dov'è una nota su una corda, o che nota c'è a un certo tasto |

## Opzioni

Alcuni esercizi hanno delle opzioni nella barra in basso, per aggiungere difficoltà:
in giallo quelle attive, in grigio quelle spente. Il browser le ricorda per la volta
successiva.

| Esercizio | Opzione |
|---|---|
| Scale | Diteggiature: suonare la scala dalla tonica su una corda |
| Circolo delle quarte | Sequenza sul manico: suonare la sequenza su una corda |
| Intervalli | Diteggiature: suonare l'intervallo dalla prima nota su una corda |
| Triadi | 1° e 2° rivolto oltre allo stato fondamentale |

## Per chi sviluppa

Pagina HTML con CSS e JavaScript puro, senza dipendenze.

- **Provarlo**: apri `index.html` nel browser.
- **Generare il file unico**: `python build.py` crea `dist/SoF.html`
  (`python build.py v1.0` per scriverci anche la versione).
- **Pubblicare una versione**: crea e invia un tag, ad esempio `git tag v1.0` e poi
  `git push origin v1.0`. La GitHub Action genera `SoF.html` con quella versione e lo
  allega alla Release.
