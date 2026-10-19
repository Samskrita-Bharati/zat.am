// Original game adapted from https://github.com/AmanRaj1608/awesome-rock-paper-scissor
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const choices = ['r', 'p', 's'];
  const names = { r: 'शिलाखण्डः (Rock)', p: 'पत्रम् (Paper)', s: 'कर्तरी (Scissors)' };
  const beats = { r: 's', p: 'r', s: 'p' };
  const digits = (n) => String(n).replace(/\d/g, (d) => '०१२३४५६७८९'[d]);
  let wins = 0, losses = 0, draws = 0, rounds = 0;
  let lastSubmittedRound = -1, soundOn = true, saving = false;
  let startedAt = null, api = null, loading = null, resetBeforeNextSubmit = false;
  let pendingAttempt = null;

  function loadScoring() {
    if (api) return Promise.resolve(api);
    if (!loading) loading = import('../js/game-score.js').then((module) => {
      module.initGameScore({ gameId: '002-zpk', gameName: 'शिलाखण्डः, पत्रम्, कर्तरी' });
      api = module;
      return api;
    }).catch((error) => { loading = null; throw error; });
    return loading;
  }
  loadScoring().catch((error) => console.warn('Local play remains available; shared scoring could not load.', error));
  function percentage() { return Math.round(wins / (wins + losses) * 100); }
  function update() {
    $('user-score').textContent = digits(wins);
    $('computer-score').textContent = digits(losses);
    $('round-count').textContent = digits(rounds);
    $('draw-count').textContent = digits(draws);
    $('win-percentage').textContent = wins + losses ? `${digits(percentage())}%` : '—';
    $('submit-score').disabled = saving || wins + losses === 0 || rounds === lastSubmittedRound;
    choices.forEach((key) => { $(key).disabled = saving; });
  }
  function stopAudio() {
    choices.forEach((key) => { const audio = $(`audio-${key}`); audio.pause(); audio.currentTime = 0; });
  }
  function playAudio(key) {
    stopAudio();
    if (soundOn) $(`audio-${key}`).play().catch((error) => {
      console.warn('Pronunciation could not play.', error);
      $('save-status').textContent = 'Pronunciation unavailable. Check the audio files and browser sound settings.';
    });
  }
  function play(key) {
    if (saving) return;
    if (startedAt === null) { startedAt = Date.now(); if (api) api.resetGameScore(); }
    pendingAttempt = null;
    const computer = choices[Math.floor(Math.random() * 3)];
    const result = key === computer ? 'draw' : beats[key] === computer ? 'win' : 'lose';
    if (result === 'win') wins++;
    else if (result === 'lose') losses++;
    else draws++;
    rounds++;
    choices.forEach((item) => { $(item).className = 'choice'; });
    $(key).classList.add(result);
    $('round-feedback').textContent = `Computer chose ${names[computer]}. ${result === 'win' ? 'You win!' : result === 'lose' ? 'Computer wins.' : 'It’s a draw.'}`;
    $('save-status').textContent = wins + losses ? 'Your current percentage is ready to submit.' : 'Draw. Play a round with a win or loss to enable submission.';
    update();
    playAudio(key);
  }
  async function submit() {
    if (saving || wins + losses === 0 || rounds === lastSubmittedRound) return;
    saving = true;
    // Keep a stable snapshot for retries, and block play while it is being sent.
    if (!pendingAttempt) pendingAttempt = {
      score: percentage(),
      metrics: { wins, losses, draws, rounds, decidingRounds: wins + losses,
        sessionElapsedSeconds: Math.floor((Date.now() - startedAt) / 1000) },
    };
    const attempt = pendingAttempt;
    $('save-status').textContent = 'Saving your score…';
    update();
    try {
      const shared = await loadScoring();
      if (resetBeforeNextSubmit) {
        shared.resetGameScore();
        resetBeforeNextSubmit = false;
      }
      const result = await shared.submitGameScore(attempt.score, { result: 'completed', metrics: attempt.metrics });
      if (result.ok || result.reason === 'already-submitted') {
        lastSubmittedRound = rounds;
        resetBeforeNextSubmit = true;
        pendingAttempt = null;
        $('save-status').textContent = `Submitted ${attempt.score}/100. The leaderboard counts your best attempt. Keep playing to submit an updated percentage.`;
      } else {
        $('save-status').textContent = result.reason === 'not-signed-in' ?
          'Sign in to Zat.am, then press Submit My Score again. Your counters are still here.' :
          'Score was not saved. Please try again.';
      }
    } catch (error) {
      console.warn('Score submission failed.', error);
      $('save-status').textContent = 'Could not save your score. Check your connection and try again. Your counters are still here.';
    } finally {
      saving = false;
      update();
    }
  }
  choices.forEach((key) => $(key).addEventListener('click', () => play(key)));
  $('music').addEventListener('click', () => {
    soundOn = !soundOn;
    $('music').textContent = soundOn ? 'Sound On' : 'Sound Off';
    $('music').setAttribute('aria-pressed', String(soundOn));
    if (!soundOn) stopAudio();
  });
  $('submit-score').addEventListener('click', submit);  $('submit-score').addEventListener('click', submit);

  $('rs').addEventListener('click', () => playAudio('r'));
  $('ps').addEventListener('click', () => playAudio('p'));
  $('ss').addEventListener('click', () => playAudio('s'));

  update();
})();