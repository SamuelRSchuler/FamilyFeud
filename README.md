# Family Feud — Game Night

Open **index.html** in your browser by double-clicking it. No installation, server, internet connection, or build step is needed. Keep `index.html`, `styles.css`, `game.js`, and `questions.js` in the same folder.

## Playing

- Click an answer card to flip it over and add its points once.
- Click **Wrong answer** to add a strike. The overlay shows all accumulated strikes; click it to dismiss it (Escape also works).
- At three strikes, the score locks. You can still reveal remaining answers, but they add no points.
- **Reset round** clears the score, strikes, and revealed answers for the current question.
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

Game progress lasts until you refresh or close the page. The score is for the current round; there are no team totals.
