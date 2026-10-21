/* Quiz content. Edit freely — `ans` is the index (0/1) of the "correct" option. */
const IMG = "static/assets/img/ques_images/";
window.DBM = {
  defaultOwner: "meghana m",
  maxName: 15,
  // q = text about the quiz owner ({n} = owner's name); qs = same question asked to the owner when creating a quiz
  questions: [
    { head: "9/header.webp", emo: "🥹", q: "what makes {n} happy?", qs: "what makes you happy?", ans: 1,
      opts: [{ img: "9/1.webp", t: "Compliments 🥰" }, { img: "9/4.webp", t: "Sleeping 😴" }] },
    { head: "1/header.webp", emo: "📝", q: "when did {n} usually study for exams?", qs: "when do you usually study for exams?", ans: 0,
      opts: [{ img: "1/1-alt.webp", t: "The night before 🌙" }, { img: "1/3.webp", t: "Didn't study 💀" }] },
    { head: "2/header.webp", emo: "📺", q: "which cartoon does {n} like most?", qs: "which cartoon do you like most?", ans: 1,
      opts: [{ img: "2/8.webp", t: "Ben 10 👽" }, { img: "2/6.webp", t: "Tom and Jerry 🐱" }] },
    { head: "3/header.webp", emo: "😤", q: "what does {n} hate the most?", qs: "what do you hate the most?", ans: 1,
      opts: [{ img: "3/1.webp", t: "Bad smells 🤢" }, { img: "3/5.webp", t: "Broken promises 🫤" }] },
    { head: "5/header.webp", emo: "🍬", q: "what's {n}'s go-to sweet or tangy treat?", qs: "what's your go-to sweet or tangy treat?", ans: 0,
      opts: [{ img: "5/7.webp", t: "Dairy Milk Chocolate 🍫" }, { img: "5/9.webp", t: "Center Fresh 🫧" }] },
    { head: "4/header.webp", emo: "🏸", q: "what was {n}'s favorite game as a kid?", qs: "what was your favorite game as a kid?", ans: 0,
      opts: [{ img: "4/2.webp", t: "Badminton 🏸" }, { img: "4/6.webp", t: "Snakes & Ladders 🎲" }] },
    { head: "6/header.webp", emo: "😨", q: "what is {n} most scared of?", qs: "what are you most scared of?", ans: 0,
      opts: [{ img: "6/0.webp", t: "Injections 💉" }, { img: "6/1.webp", t: "Roller coasters 🎢" }] },
    { head: "7/header.webp", emo: "😶", q: "what's {n}'s bad habit?", qs: "what's your bad habit?", ans: 1,
      opts: [{ img: "7/2.webp", t: "Staying up late 🌙" }, { img: "7/1-alt.webp", t: "Overthinking everything 🧠" }] },
    { head: "8/header.webp", emo: "🍔", q: "what's {n}'s favorite fast food?", qs: "what's your favorite fast food?", ans: 1,
      opts: [{ img: "8/10.webp", t: "Manchurian 🥡" }, { img: "8/3.webp", t: "Pani Puri 😋" }] },
    { head: "10/header.webp", emo: "🌶️", q: "how much spice can {n} handle?", qs: "how much spice can you handle?", ans: 1,
      opts: [{ img: "10/0.webp", t: "No spice 😌" }, { img: "10/1.webp", t: "Pretty spicy 🔥" }] }
  ],
  avatars: [["🐶", "#f6e3cf"], ["🐯", "#ffe9c4"], ["🐸", "#dff3d4"], ["🐵", "#f3e1d2"], ["🦄", "#f0e0ff"], ["🐧", "#dcecff"], ["🐨", "#e4e9ef"], ["🐮", "#ececec"]],
  // result-screen copy by score tier
  tiers: [
    { min: 8, say: "you made me smile 😆...I'll never block you 😏", pic: "bubu-8.webp" },
    { min: 5, say: "not bad 🙂... I'll keep you for now 🤨", pic: "bubu-standing.webp" },
    { min: 0, say: "who even are you? 😤 you're blocked 🚫", pic: "bubu-confused.webp" }
  ],
  // [bubble side, text] — typed out one after another on the result screen
  lines: [["L", "should i block you?"], ["R", "but...I'm not your fake friend😏"], ["L", "then prove you're real friend😏"], ["R", "just look at my score😏"], ["L", "okay...let's see ✨"]]
};
