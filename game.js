'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const questions = window.FEUD_QUESTIONS;
  const teamName = team => $(`team-name-${team}`).value.trim() || `Team ${team + 1}`;
  let activeTeam = 0;
  const teamScores = [0, 0];
  let award = null;
  let current = 0;
  let score = 0;
  let strikes = 0;
  let revealed = new Set();
  const valid = Array.isArray(questions) && questions.length > 0 && questions.every(q =>
    q && typeof q.question === 'string' && q.question.trim() && Array.isArray(q.answers) &&
    q.answers.length >= 1 && q.answers.length <= 12 && q.answers.every(a =>
      a && typeof a.text === 'string' && a.text.trim() && Number.isFinite(a.points) && a.points >= 0));
  if (!valid) {
    $('error').hidden = false;
    $('error').textContent = 'Check questions.js: add at least one question with 1–12 answers, each with text and nonnegative numeric points.';
    for (const id of ['wrong', 'reset', 'next', 'question-select', 'play-0', 'play-1', 'award-0', 'award-1', 'reset-game']) $(id).disabled = true;
    return;
  }
  function update() {
    $('score').textContent = score;
    for (let team = 0; team < 2; team++) {
      $(`team-score-${team}`).textContent = teamScores[team];
      $(`play-${team}`).setAttribute('aria-pressed', String(team === activeTeam));
      $(`play-${team}`).textContent = team === activeTeam ? 'Playing this round' : 'Select to play';
      $(`team-panel-${team}`).classList.toggle('active', team === activeTeam);
      $(`award-${team}`).disabled = award !== null || score === 0;
      $(`award-${team}`).textContent = `Award ${score} points to ${teamName(team)}`;
    }
    $('undo-award').disabled = award === null;
    $('award-status').textContent = award ? `${award.points} points awarded to ${teamName(award.team)}. Undo to correct the award.` :
      `${teamName(activeTeam)} is playing. Award the round points to either team${strikes >= 3 ? ' to resolve the steal' : ' when the round is decided'}.`;
    $('strikes').textContent = Array.from({length: 3}, (_, i) => i < strikes ? '✕' : '—').join(' ');
    $('strikes').setAttribute('aria-label', `${strikes} of 3 strikes`);
    $('wrong').disabled = strikes >= 3 || award !== null;
    $('status').textContent = award ? 'Round awarded. Reveal remaining answers or start the next question.' : strikes >= 3 ? 'Three strikes! Score is locked. Reveal the remaining answers or start a new round.' :
      revealed.size === questions[current].answers.length ? 'All answers revealed! Ready for the next question?' : '';
  }
  function loadRound(index) {
    current = index;
    award = null;
    score = 0;
    strikes = 0;
    revealed = new Set();
    if ($('strike-overlay').open) $('strike-overlay').close();
    $('round-number').textContent = String(current + 1).padStart(2, '0');
    $('question').textContent = questions[current].question;
    $('question-select').value = String(current);
    $('next').textContent = current === questions.length - 1 ? 'First question ↺' : 'Next question →';
    $('board').replaceChildren();
    questions[current].answers.forEach((answer, index) => {
      const card = document.createElement('button');
      card.className = 'answer-card';
      card.setAttribute('aria-label', `Reveal answer ${index + 1}`);
      const inner = document.createElement('span');
      inner.className = 'card-inner';
      const front = document.createElement('span');
      front.className = 'card-front';
      front.textContent = index + 1;
      const back = document.createElement('span');
      back.className = 'card-back';
      const text = document.createElement('span');
      text.textContent = answer.text;
      const points = document.createElement('strong');
      points.textContent = answer.points;
      back.append(text, points);
      inner.append(front, back);
      card.append(inner);
      card.addEventListener('click', () => {
        if (revealed.has(index)) return;
        revealed.add(index);
        if (strikes < 3 && award === null) score += answer.points;
        card.classList.add('revealed');
        card.setAttribute('aria-label', `${answer.text}, ${answer.points} points${strikes >= 3 || award !== null ? ', score locked' : ''}`);
        card.setAttribute('aria-disabled', 'true');
        update();
      });
      $('board').append(card);
    });
    update();
  }
  questions.forEach((q, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${index + 1}. ${q.question}`;
    $('question-select').append(option);
  });
  $('wrong').addEventListener('click', () => {
    if (strikes >= 3 || award !== null) return;
    strikes++;
    update();
    $('overlay-xs').textContent = Array(strikes).fill('✕').join(' ');
    $('strike-title').textContent = strikes === 3 ? 'THREE STRIKES — ROUND OVER' : 'WRONG ANSWER';
    $('overlay-message').textContent = strikes === 3 ? 'Score locked. Click to view the board.' : '';
    $('strike-overlay').showModal();
  });
  $('dismiss-strikes').addEventListener('click', () => $('strike-overlay').close());
  $('strike-overlay').addEventListener('click', event => {
    if (event.target === $('strike-overlay')) $('strike-overlay').close();
  });
  for (let team = 0; team < 2; team++) {
    $(`team-name-${team}`).addEventListener('input', update);
    $(`play-${team}`).addEventListener('click', () => {
      activeTeam = team;
      update();
    });
    $(`award-${team}`).addEventListener('click', () => {
      if (award !== null || score === 0) return;
      award = { team, points: score };
      teamScores[team] += score;
      update();
    });
  }
  $('undo-award').addEventListener('click', () => {
    if (award === null) return;
    teamScores[award.team] -= award.points;
    award = null;
    update();
  });
  $('reset-game').addEventListener('click', () => {
    if (!window.confirm('Reset both team totals and return to the first question?')) return;
    teamScores.fill(0);
    activeTeam = 0;
    loadRound(0);
  });
  $('reset').addEventListener('click', () => loadRound(current));
  $('next').addEventListener('click', () => loadRound((current + 1) % questions.length));
  $('question-select').addEventListener('change', event => loadRound(Number(event.target.value)));
  loadRound(0);
})();
