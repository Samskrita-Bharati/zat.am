/* Countdown/scoring adapter; original placement and matching remain in find.js. */
(function () {
  "use strict";
  var run = null, sharedPromise = null;
  var dialog = document.getElementById("ask-result");
  var status = document.getElementById("ask-save-status");
  var retry = document.getElementById("ask-retry-score");
  var replay = document.getElementById("ask-replay");
  var close = document.getElementById("ask-close");
  var start = document.getElementById("ask-start");
  var next = document.getElementById("ask-next");
  function prepare() {
    if (!sharedPromise) sharedPromise = import("../js/game-score.js").catch(function (error) {
      console.warn("[Name Search] Shared scoring could not load.", error);
      return null;
    });
    return sharedPromise;
  }
  function difficulty(size) {
    if (size === 5) return { id: "1", name: "Easy", duration: 60, next: 7 };
    if (size === 7) return { id: "2", name: "Medium", duration: 120, next: 10 };
    if (size === 10) return { id: "3", name: "Hard", duration: 180, next: null };
    return { id: "size-" + size, name: "Custom " + size + " × " + size, duration: 180, next: null };
  }
  function seconds(ctx) {
    if (ctx.final) return ctx.final.seconds;
    return ctx.started === null ? 0 : Math.max(0, (performance.now() - ctx.started) / 1000);
  }
  function rawPoints(ctx) { return Math.max(0, ctx.level.duration - Math.floor(seconds(ctx))); }
  function score(ctx) { return Math.max(0, Math.round(rawPoints(ctx) / ctx.level.duration * 100) - ctx.penalty); }
  function time(value) {
    var total = Math.max(0, Math.floor(value));
    return String(Math.floor(total / 60)).padStart(2, "0") + ":" + String(total % 60).padStart(2, "0");
  }
  function render(ctx) {
    document.getElementById("ask-time").textContent = time(rawPoints(ctx));
    document.getElementById("ask-points").textContent = rawPoints(ctx) + " / " + ctx.level.duration;
    document.getElementById("ask-score").textContent = (ctx.phase === "timeout" ? 0 : score(ctx)) + " / 100";
    document.getElementById("ask-help-penalty").textContent = String(ctx.penalty);
  }
  function setHint(id, enabled) {
    var element = document.getElementById(id);
    element.setAttribute("aria-disabled", String(!enabled));
    element.setAttribute("tabindex", enabled ? "0" : "-1");
  }
  function hints(ctx) {
    setHint("first-help", ctx.phase === "playing");
    setHint("more-help", ctx.phase === "playing" && ctx.first);
  }
  function busy(ctx, value) {
    ctx.saving = value;
    [retry, replay, close, next].forEach(function (button) { button.disabled = value; });
  }
  async function submit(ctx) {
    if (ctx.phase !== "won" || ctx.saved || ctx.saving) return;
    busy(ctx, true); retry.hidden = true;
    status.textContent = "Saving score to leaderboard…";
    try {
      var api = await ctx.ready;
      if (!api) { status.textContent = "We couldn’t connect to the leaderboard. Your result is still shown here."; return; }
      var result = await api.submitGameScore(ctx.final.score, {
        result: "completed", levelId: ctx.level.id, levelName: ctx.level.name,
        metrics: {
          levelId: ctx.level.id, levelName: ctx.level.name,
          gridSize: ctx.size, namesSet: ctx.names === "a" ? "Arjuna" : "Krishna",
          wordsFound: ctx.found, wordsTotal: ctx.total,
          timeLimitSeconds: ctx.level.duration, remainingPoints: ctx.final.points,
          helpPenalty: ctx.penalty, firstHelpUsed: ctx.first, moreHelpUsed: ctx.more,
          puzzleSeconds: ctx.final.seconds, scoringMethod: "countdown-points-v1"
        }
      });
      if (result && (result.ok || result.reason === "already-submitted")) {
        ctx.saved = true; status.textContent = "Score saved to leaderboard.";
      } else {
        status.textContent = result && result.reason === "not-signed-in"
          ? "Sign in to Zat.am, then retry to save this score." : "Your score wasn’t saved. Please retry.";
        retry.hidden = false;
      }
    } catch (error) {
      console.warn("[Name Search] Score submission failed.", error);
      status.textContent = "Couldn’t save your score. Please retry."; retry.hidden = false;
    } finally { busy(ctx, false); }
  }
  function finish(ctx, won) {
    if (ctx.phase !== "playing") return;
    ctx.final = Object.freeze({ score: won ? score(ctx) : 0, seconds: Math.min(seconds(ctx), ctx.level.duration), points: rawPoints(ctx) });
    ctx.phase = won ? "won" : "timeout";
    clearInterval(ctx.interval); ctx.interval = null;
    hints(ctx); render(ctx);
    document.getElementById("ask-result-heading").textContent = won ? "उत्तमम्!" : "Time’s up!";
    document.getElementById("ask-result-message").textContent = won ? "You found all the names." : "Try this difficulty again.";
    document.getElementById("result-difficulty").textContent = ctx.level.name;
    document.getElementById("result-time").textContent = time(ctx.final.seconds);
    document.getElementById("result-found").textContent = ctx.found + " / " + ctx.total;
    document.getElementById("result-help").textContent = "−" + ctx.penalty;
    document.getElementById("result-score").textContent = ctx.final.score + " / 100";
    next.hidden = !won || !ctx.level.next;
    document.getElementById("ask-result-actions").appendChild(replay);
    if (!dialog.open) dialog.showModal();
    if (won) submit(ctx);
    else { status.textContent = "This unfinished puzzle wasn’t submitted."; retry.hidden = true; }
  }
  function canPlay() {
    if (!run || run.phase !== "playing") return false;
    if (seconds(run) >= run.level.duration) { finish(run, false); return false; }
    return true;
  }
  window.askScoring = {
    begin: function (options) {
      if (run && run.interval !== null) clearInterval(run.interval);
      run = {
        total: options.total, size: options.size, names: options.names, level: difficulty(options.size),
        started: null, found: 0, penalty: 0, first: false, more: false,
        phase: "ready", final: null, saving: false, saved: false, interval: null, ready: null
      };
      document.getElementById("gridParent").setAttribute("data-playing", "false");
      document.getElementById("arjuna-label").setAttribute("data-active", String(options.names === "a"));
      document.getElementById("sk").setAttribute("data-active", String(options.names !== "a"));
      start.disabled = false; start.hidden = false;
      hints(run); render(run);
    },
    start: function () {
      if (!run || run.phase !== "ready" || !run.total) return;
      var ctx = run;
      ctx.started = performance.now(); ctx.phase = "playing";
      ctx.ready = prepare().then(function (api) {
        if (!api) return null;
        try {
          api.initGameScore({ gameId: "007-ask", gameName: "अन्वेषणम्", levelId: ctx.level.id, levelName: ctx.level.name });
          return api;
        } catch (error) { console.warn("[Name Search] Score initialization failed.", error); return null; }
      });
      document.getElementById("gridParent").setAttribute("data-playing", "true");
      start.hidden = true; hints(ctx); render(ctx);
      ctx.interval = setInterval(function () { if (canPlay()) render(ctx); }, 200);
    },
    canPlay: canPlay,
    isComplete: function () { return !!(run && (run.phase === "won" || run.phase === "timeout")); },
    found: function (count) {
      if (!canPlay() || !Number.isInteger(count) || count <= 0) return;
      run.found += Math.min(count, run.total - run.found); render(run);
    },
    help: function (kind) {
      if (!canPlay() || (kind === "more" && !run.first)) return false;
      if (kind === "first" && !run.first) { run.first = true; run.penalty += 10; }
      else if (kind === "more" && !run.more) { run.more = true; run.penalty += 20; }
      hints(run); render(run); return true;
    },
    complete: function () { if (canPlay() && run.found === run.total) finish(run, true); }
  };
  start.addEventListener("click", window.askScoring.start);
  retry.addEventListener("click", function () { if (run) submit(run); });
  replay.addEventListener("click", function () { if (!run || !run.saving) window.location.reload(); });
  next.addEventListener("click", function () {
    if (run && run.phase === "won" && run.level.next && !run.saving) {
      window.location.href = window.location.origin + window.location.pathname + "?size=" + run.level.next + "&m=" + run.names;
    }
  });
  close.addEventListener("click", function () { if (!run || !run.saving) dialog.close(); });
  dialog.addEventListener("close", function () { document.getElementById("ask-board-actions").appendChild(replay); });
  dialog.addEventListener("cancel", function (event) { if (run && run.saving) event.preventDefault(); });
  prepare();
}());
