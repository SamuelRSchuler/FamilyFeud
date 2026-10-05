# Family Feud — Game Night

Open **index.html** in your browser by double-clicking it. No installation, server, internet connection, or build step is needed. Keep `index.html`, `styles.css`, `game.js`, and `questions.js` in the same folder.

## Playing

- Edit the team-name fields to name your teams. Names appear in award buttons and round messages; blank names fall back to Team 1/Team 2.
- Select **Team 1** or **Team 2** to show who is playing. Switching teams does not reset the round or transfer points.
- Click an answer card to flip it over and add its points once.
- Click **Wrong answer** to add a strike. The overlay shows all accumulated strikes; click it to dismiss it (Escape also works).
- At three strikes, the score locks. You can still reveal remaining answers, but they add no points.
- Use **Award points to Team 1/2** to give the round total to the winning team, including a steal after three strikes. Awarding locks the round points and prevents a second award. **Undo award** reverses the transfer so you can correct the winner. After three strikes, reveals still add no points; award the frozen round total to resolve a steal.
- Team totals carry over between rounds. **Reset entire game** clears both totals after confirmation.
- **Reset round** clears the score, strikes, and revealed answers for the current question, keeping already awarded team totals.
- **Next question** starts a fresh round. After the last question it returns to the first.
- **Choose a question** lets you jump to any round, clearing the round score and strikes.

## Changing questions

Open **questions.js** in a text editor. Edit or add entries in `window.FEUD_QUESTIONS`, following the existing format:

```javascript
{
  question: "Name something you eat for breakfast.",
  answers: [
    { text: "Eggs", points: 40 },
    { text: "Toast", points: 30 }
  ]
}
```

Separate question entries and answer entries with commas. Each question supports 1–12 answers. Points must be nonnegative numbers. The samples are illustrative, not actual survey results. Save the file and refresh the browser to load your edits. The game uses a regular script file so custom questions work directly from a local folder without fetching files or needing a server.

Game progress lasts until you refresh or close the page. Round points and the two team totals are separate. Refreshing or closing the page clears all scores. Undo an incorrect award before leaving or resetting its round; undo is only available in the current round.

## Final round

Open **final.html** directly in your browser. Keep **final-questions.js** beside it. This file is separate from the regular-round `questions.js`.

Edit `window.FEUD_FINAL_QUESTIONS` in **final-questions.js** to change prompts and the two players' answers and points. Each entry pairs one question with `player1` and `player2`, each containing `answer` and numeric `points`. The sample has five questions; add or remove entries as needed. Save and refresh to load changes.

Question prompts stay in `final-questions.js` for the host and are not displayed on the final page. The numbered answer rows match the question order in that file. Click a row once to reveal the answer and again to reveal its points and add them to the combined final-round total. Further clicks do not add points again. Enter and Space also reveal a focused row. The final-round total is independent of the main game's team totals.
