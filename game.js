'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const questions = window.FEUD_QUESTIONS;
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
    for (const id of ['wrong', 'reset', 'next', 'question-select']) $(id).disabled = true;
    return;
  }
  function update() {
    $('score').textContent = score;
    $('strikes').textContent = Array.from({length: 3}, (_, i) => i < strikes ? '✕' : '—').join(' ');
    $('strikes').setAttribute('aria-label', `${strikes} of 3 strikes`);
    $('wrong').disabled = strikes >= 3;
    $('status').textContent = strikes >= 3 ? 'Three strikes! Score is locked. Reveal the remaining answers or start a new round.' :
      revealed.size === questions[current].answers.length ? 'All answers revealed! Ready for the next question?' : '';
  }
  function loadRound(index) {
    current = index;
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
        if (strikes < 3) score += answer.points;
        card.classList.add('revealed');
        card.setAttribute('aria-label', `${answer.text}, ${answer.points} points${strikes >= 3 ? ', score locked' : ''}`);
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
    if (strikes >= 3) return;
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
  $('reset').addEventListener('click', () => loadRound(current));
  $('next').addEventListener('click', () => loadRound((current + 1) % questions.length));
  $('question-select').addEventListener('change', event => loadRound(Number(event.target.value)));
  loadRound(0);
})();
