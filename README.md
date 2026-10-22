# Don't Block Me – quiz clone

A static, dependency‑free clone of the "Will <name> block you?" quiz, rebuilt from the screen recording
(home → name → 10 questions → animated result → scoreboard → create‑your‑own‑quiz).

## Run
Just open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000     # then visit http://localhost:8000

## Files
- `index.html` – all screens (home, name, quiz, loading, result, modals)
- `js/data.js` – quiz questions, correct answers, avatars, result messages (edit here)
- `js/app.js`  – navigation, quiz engine, result animation, scoreboard (localStorage), quiz creator
- `css/app.css` – styles for the new screens; `next/…/*.css` + `static/` come from your original home‑page export

## Create your own quiz
"create your own quiz" lets you enter your name and answer the 10 questions; you get a share link
(`index.html#/q/…`) that encodes your name + answers. Friends who open it play *your* quiz and their score is
checked against your answers.

The scoreboard starts empty and lists only people who have played the quiz in this browser. Notes: avatar art on
the scoreboard uses emoji (the original avatar images weren't in the zip); a few answer
photos differ slightly from the video where the original image files weren't included.

https://rdkannadatech7-cmd.github.io/dont-block-me/
