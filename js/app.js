/* Don't Block Me — single-page quiz app (no build step, no dependencies) */
(function () {
  "use strict";
  var D = window.DBM;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var IMGB = "static/assets/img/";
  var timers = [];
  var later = function (fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; };
  var clearTimers = function () { timers.forEach(clearTimeout); timers = []; };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- state ---------- */
  var S = { owner: D.defaultOwner, key: null, mode: "play", player: store.get("dbm:player", ""), i: 0, picks: [], custom: false, lastPlay: null };

  function decodeHash() {
    var m = location.hash.match(/^#\/q\/(.+)$/);
    if (!m) return;
    try {
      var o = JSON.parse(decodeURIComponent(escape(atob(m[1].replace(/-/g, "+").replace(/_/g, "/")))));
      if (o && o.o && Array.isArray(o.k) && o.k.length === D.questions.length) {
        S.owner = String(o.o).slice(0, D.maxName); S.key = o.k.map(Number); S.custom = true;
      }
    } catch (e) {}
  }
  function encodeKey(owner, key) {
    var j = JSON.stringify({ o: owner, k: key });
    return btoa(unescape(encodeURIComponent(j))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  var answerOf = function (i) { return S.key ? S.key[i] : D.questions[i].ans; };
  var ownerName = function () { return S.owner; };

  /* ---------- helpers ---------- */
  function show(id) {
    $$(".screen").forEach(function (s) { s.classList.toggle("active", s.id === id); });
    window.scrollTo(0, 0);
  }
  function toast(msg) {
    var t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }
  function fill(q) { return esc(q).replace(/\{n\}/g, '<span class="pink u-wave pk">' + esc(ownerName()) + "</span>"); }

  /* ---------- home ---------- */
  function applyOwner() {
    if (S.owner === D.defaultOwner) return;
    var w = document.createTreeWalker($("#screen-home"), NodeFilter.SHOW_TEXT), n, list = [];
    while ((n = w.nextNode())) if (n.nodeValue.indexOf(D.defaultOwner) > -1) list.push(n);
    list.forEach(function (t) { t.nodeValue = t.nodeValue.split(D.defaultOwner).join(S.owner); });
<<<<<<< HEAD
    $$("[aria-label]", $("#screen-home")).forEach(function (e) { e.setAttribute("aria-label", e.getAttribute("aria-label").split(D.defaultOwner).join(S.owner)); });
    document.title = "Will " + S.owner + " block you? - Don't Block Me";
  }

  /* ---------- scoreboard (Supabase, with localStorage fallback) ---------- */
  var SB = D.supabase, REMOTE = null;
  function sb(path, opts) {
    opts = opts || {};
    opts.headers = Object.assign({ apikey: SB.key, "Content-Type": "application/json" }, opts.headers || {});
    return fetch(SB.url + "/rest/v1/" + path, opts).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }
  // load every result for this quiz owner from the database, then redraw the boards
  function loadBoard() {
    var q = SB.table + "?select=id,player_name,true_score,avatar,avatar_color,created_at" +
      "&quiz_owner=eq." + encodeURIComponent(S.owner) +
      "&order=true_score.desc,created_at.asc&limit=500";
    return sb(q).then(function (rows) {
      REMOTE = rows.map(function (r) {
        return { id: r.id, n: r.player_name, s: r.true_score, a: r.avatar, c: r.avatar_color, t: Date.parse(r.created_at) };
      });
    }).catch(function () { REMOTE = null; }).then(function () {
      renderBoard("#home-board"); renderBoard("#res-board");
    });
  }
  // save the REAL score; resolves to the new row id (or null if offline)
  function saveResult(av) {
    return sb(SB.table, {
      method: "POST", headers: { Prefer: "return=representation" },
      body: JSON.stringify({ quiz_owner: S.owner, player_name: S.player, true_score: S.realScore, avatar: av[0], avatar_color: av[1] })
    }).then(function (rows) { return rows && rows[0] ? rows[0].id : null; }).catch(function () { return null; });
  }
  function boardKey() { return "dbm:scores:" + S.owner.toLowerCase(); }
  function boardData() {
    var mine = (REMOTE ? REMOTE.slice() : store.get(boardKey(), []));
=======
    $$("[aria-label]", $("#screen-home")).forEach(function (e) { e.setAttribute("aria-label", e.getAttribute("aria-label").split("Meghana M").join(S.owner)); });
    document.title = "Will " + S.owner + " block you? - Don't Block Me";
  }

  /* ---------- scoreboard ---------- */
  function boardKey() { return "dbm:scores:" + S.owner.toLowerCase(); }
  function boardData() {
    var mine = store.get(boardKey(), []);
>>>>>>> f7d9d298f3a7e22f480d973c582fdd3e7256ae37
    mine.sort(function (a, b) { return b.s - a.s || a.t - b.t; });
    return mine;
  }
  function renderBoard(mountSel) {
    var data = boardData(), top = data.slice(0, 10);
    var html = '<div class="sb"><div class="sb-head"><span class="tape"></span><b><i>🏆</i>Scoreboard<i>🏆</i></b></div>' +
      '<div class="sb-count">' + data.length + " friend" + (data.length === 1 ? "" : "s") + " played</div>";
    if (!data.length) html += '<p class="sb-more">nobody has played yet — be the first! 🎉</p>';
    top.forEach(function (r, i) {
<<<<<<< HEAD
      var me = S.lastId ? r.id === S.lastId : (S.lastPlay && r.t === S.lastPlay);
=======
      var me = S.lastPlay && r.t === S.lastPlay;
>>>>>>> f7d9d298f3a7e22f480d973c582fdd3e7256ae37
      html += '<div class="sb-row' + (me ? " me" : "") + '" style="animation-delay:' + i * 60 + 'ms">' +
        (i < 3 ? '<span class="sb-rank n' + (i + 1) + '">' + (i + 1) + "</span>" : "") +
        '<div class="sb-ava" style="background:' + r.c + '">' + r.a + "</div>" +
        '<div class="sb-main"><div class="sb-top"><span class="sb-name">' + esc(r.n) + (me ? "<em>you</em>" : "") +
        '</span><span class="sb-score">' + r.s + "<small>/10</small></span></div>" +
        '<div class="sb-bar"><i style="width:' + r.s * 10 + '%"></i></div></div></div>';
    });
    if (data.length > 10) html += '<p class="sb-more">+ ' + (data.length - 10) + " more friends</p>";
    $(mountSel).innerHTML = html + "</div>";
  }

  /* ---------- name screen ---------- */
  function openName(mode) {
    S.mode = mode;
    $("#name-title").innerHTML = mode === "create" ? "what's your <span class=\"pink u-wave pk\">name</span>?" : "what's your <span class=\"pink u-wave pk\">name</span>?";
    var inp = $("#name-input");
    inp.value = mode === "create" ? "" : (S.player || "");
    updCount();
    show("screen-name");
    later(function () { inp.focus(); }, 380);
  }
  function updCount() {
    var v = $("#name-input").value;
    $("#name-cnt").textContent = v.length + "/" + D.maxName;
    $("#name-err").textContent = "";
  }
  function submitName() {
    var v = $("#name-input").value.trim().replace(/\s+/g, " ");
    if (!v) { $("#name-err").textContent = "please enter your name 🙂"; return; }
    if (S.mode === "play") { S.player = v; store.set("dbm:player", v); }
    else S.creator = v;
    startQuiz();
  }

  /* ---------- quiz ---------- */
  var DOODLES = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16];
  var SPOTS = [[8, 18], [86, 12], [4, 70], [90, 64], [24, 6], [74, 80]];
  function startQuiz() {
    clearTimers();
    S.i = 0; S.picks = [];
    $("#quiz-prog").innerHTML = D.questions.map(function (q, i) { return "<span>" + (i + 1) + "</span>"; }).join("");
    show("screen-quiz");
    renderQ(true);
  }
  function renderQ(first) {
    var q = D.questions[S.i], body = $("#qbody"), create = S.mode === "create";
<<<<<<< HEAD
    $$("#quiz-prog span").forEach(function (s, i) { var bad = i < S.i && S.mode === "play" && (D.prank || S.picks[i] !== answerOf(i));
=======
    $$("#quiz-prog span").forEach(function (s, i) { var bad = i < S.i && S.mode === "play" && S.picks[i] !== answerOf(i);
>>>>>>> f7d9d298f3a7e22f480d973c582fdd3e7256ae37
      s.className = i < S.i ? (bad ? "wrong" : "done") : i === S.i ? "cur" : ""; s.textContent = i < S.i ? (bad ? "✕" : "✓") : i + 1; });
    var dd = "";
    for (var k = 0; k < 5; k++) {
      var sp = SPOTS[(S.i + k) % SPOTS.length], d = DOODLES[(S.i * 3 + k * 5) % DOODLES.length];
      dd += '<img class="qdoodle" alt="" src="' + IMGB + "doodles/doodle-" + d + '.svg" style="left:' + sp[0] + "%;top:" + sp[1] + "%;animation-delay:" + k * 0.6 + 's">';
    }
    var text = create ? esc(q.qs) : fill(q.q);
    body.innerHTML =
      '<div class="qhead">' + dd + '<img class="mas" alt="" src="' + IMGB + "ques_images/" + q.head + '"></div>' +
      '<span class="qlabel">Question ' + (S.i + 1) + "</span>" +
      '<div class="qtext"><span>' + text + '</span><span class="emo">' + q.emo + "</span></div>" +
      '<div class="qopts">' + q.opts.map(function (o, j) {
        var parts = o.t.split(" "), lbl = esc(o.t);
        return '<button class="opt" data-j="' + j + '"><span class="pic"><img alt="" src="' + IMGB + "ques_images/" + o.img + '"><span class="tick">✓</span></span><span class="lbl">' + lbl + "</span></button>";
      }).join("") + "</div>";
    body.classList.remove("out");
    if (!first) { body.classList.add("in"); void body.offsetWidth; body.classList.remove("in"); }
    $$(".opt", body).forEach(function (b) { b.addEventListener("click", function () { pick(+b.dataset.j, b); }); });
  }
  function pick(j, btn) {
    var wrap = $(".qopts"); if (wrap.classList.contains("lock")) return;
    wrap.classList.add("lock");
    S.picks[S.i] = j;
<<<<<<< HEAD
    var wrong = S.mode === "play" && (D.prank || j !== answerOf(S.i));
    if (wrong) {
      btn.classList.add("bad"); btn.querySelector(".tick").textContent = "✕";
      // prank: the "correct" answer is always whichever option the player did NOT pick
      var goodIdx = D.prank ? 1 - j : answerOf(S.i);
      var good = $$(".opt", wrap)[goodIdx]; later(function () { good.classList.add("good"); }, 380);
=======
    var wrong = S.mode === "play" && j !== answerOf(S.i);
    if (wrong) {
      btn.classList.add("bad"); btn.querySelector(".tick").textContent = "✕";
      var good = $$(".opt", wrap)[answerOf(S.i)]; later(function () { good.classList.add("good"); }, 380);
>>>>>>> f7d9d298f3a7e22f480d973c582fdd3e7256ae37
    } else btn.classList.add("sel");
    later(function () {
      $("#qbody").classList.add("out");
      later(function () {
        if (S.i < D.questions.length - 1) { S.i++; renderQ(false); }
        else finishQuiz();
      }, 280);
    }, wrong ? 1250 : 520);
  }
  function finishQuiz() {
    if (S.mode === "create") return finishCreate();
    var score = 0;
    S.picks.forEach(function (p, i) { if (p === answerOf(i)) score++; });
<<<<<<< HEAD
    S.realScore = score;                 // the true result (saved to the scoreboard only)
    S.score = D.prank ? 0 : score;       // what the result screen shows
    var av = D.avatars[Math.floor(Math.random() * D.avatars.length)];
    var list = store.get(boardKey(), []);
    S.lastPlay = Date.now();
    list.push({ n: S.player, s: S.realScore, a: av[0], c: av[1], t: S.lastPlay });
    store.set(boardKey(), list);                 // local fallback copy
    S.lastId = null;
    saveResult(av).then(function (id) { S.lastId = id; return loadBoard(); });   // database copy
=======
    S.score = score;
    var av = D.avatars[Math.floor(Math.random() * D.avatars.length)];
    var list = store.get(boardKey(), []);
    S.lastPlay = Date.now();
    list.push({ n: S.player, s: score, a: av[0], c: av[1], t: S.lastPlay });
    store.set(boardKey(), list);
>>>>>>> f7d9d298f3a7e22f480d973c582fdd3e7256ae37
    show("screen-loading");
    later(playResult, 1400);
  }

  /* ---------- result scene ---------- */
  var CP = IMGB + "player/completed/";
  function tier() { for (var i = 0; i < D.tiers.length; i++) if (S.score >= D.tiers[i].min) return i; return D.tiers.length - 1; }
  function playResult() {
    clearTimers();
    var hero = $("#res-hero"), tr = D.tiers[tier()];
    $("#res-name-l").textContent = ownerName(); $("#res-name-r").textContent = S.player;
    $("#res-num").innerHTML = "0<small>/ 10</small>";
    $("#res-card").classList.remove("show");
    $("#res-lower").classList.remove("show");
    $("#res-pair").classList.add("hidden"); $("#res-pair").classList.remove("walkin");
    var bb = $("#char-bubu"), dd = $("#char-dudu"), bi = $("#char-bubu img"), di = $("#char-dudu img");
    [bb, dd].forEach(function (c) { c.classList.remove("in", "hidden", "up"); });
    bb.classList.add("walking"); dd.classList.add("in");
    bi.src = CP + "bubu-walk.webp"; di.src = CP + "dudu-standing.webp";
    $$(".bubble", hero).forEach(function (b) { b.classList.remove("show"); });
    renderBoard("#res-board");
    show("screen-result");

    var flip = 0, walk = setInterval(function () {
      flip ^= 1;
      if (bb.classList.contains("walking")) bi.src = CP + (flip ? "bubu-walk-stop.webp" : "bubu-walk.webp");
    }, 380);
    timers.push(walk); // clearTimeout also clears intervals

    later(function () { bb.classList.add("in"); }, 200);
    later(function () { bb.classList.remove("walking"); bi.src = CP + "bubu-standing.webp"; }, 1500);

    // typewriter speech bubbles
    var HL = [[/\b(fake)\b/, "blue"], [/\b(real)\b/, "pink"], [/\b(score)\b/, "blue"], [/(let's see)/, "pink"], [/\b(block|keep)\b/, "pink"]];
    function paint(t) { var h = esc(t); HL.forEach(function (r) { h = h.replace(r[0], '<span class="' + r[1] + '">$1</span>'); }); return h; }
    function type(cls, txt, done) {
      $$(".bubble", hero).forEach(function (x) { x.classList.remove("show"); });
      var b = $(".bubble." + cls, hero), k = 0;
      b.innerHTML = '<span class="ghost">' + paint(txt) + '</span><span class="typed"></span>';
      b.classList.add("show");
      var iv = setInterval(function () {
        k++; $(".typed", b).innerHTML = paint(txt.slice(0, k));
        if (k >= txt.length) { clearInterval(iv); later(done, 950); }
      }, 42);
      timers.push(iv);
    }
    var lines = D.lines, li = 0;
    function nextLine() {
      if (li >= lines.length) return lookUp();
      var L = lines[li];
      if (li === 2) { bi.src = CP + "bubu-phone.webp"; di.src = CP + "dudu-confused.webp"; }
      li++; type(L[0], L[1], nextLine);
    }
    later(nextLine, 1800);

    function lookUp() {
      $$(".bubble", hero).forEach(function (x) { x.classList.remove("show"); });
      bi.src = CP + "bubu-face-up.webp"; di.src = CP + "dudu-face-up.webp";
      bb.classList.add("up"); dd.classList.add("up");
      later(dropCard, 600);
    }
    function dropCard() {
      $("#res-card").classList.add("show");
      later(function () {
        var n = 0;
        if (S.score > 0) {
          var tick = setInterval(function () {
            n++; $("#res-num").innerHTML = n + "<small>/ 10</small>";
            if (n >= S.score) { clearInterval(tick); later(finale, 1100); }
          }, 1000 / S.score);
          timers.push(tick);
        } else later(finale, 1100);
      }, 900);
    }
    later(function () { }, 0);
    hero.onclick = function () { if (!$("#res-lower").classList.contains("show")) skipToEnd(); };
  }
  function finale() {
    clearTimers();
    var hero = $("#res-hero"), t = tier(), tr = D.tiers[t], bb = $("#char-bubu"), dd = $("#char-dudu");
    var M = $(".bubble.M", hero), msg = tr.say, k = 0;
    $$(".bubble", hero).forEach(function (b) { b.classList.remove("show"); });
    $$(".walking").forEach(function (c) { c.classList.remove("walking"); });
    bb.classList.remove("up"); dd.classList.remove("up");
    $("#res-num").innerHTML = S.score + "<small>/ 10</small>";
    $("#res-card").classList.add("show");
    if (t === 0) {
      bb.classList.add("hidden"); dd.classList.add("hidden");
      var pr = $("#res-pair"); $("img", pr).src = CP + tr.pic; pr.classList.remove("hidden", "walkin"); void pr.offsetWidth; pr.classList.add("walkin");
    } else if (t === 1) { $("#char-bubu img").src = CP + "bubu-standing.webp"; $("#char-dudu img").src = CP + "dudu-standing.webp"; }
    else { $("#char-bubu img").src = CP + "bubu-confused.webp"; $("#char-dudu img").src = CP + "dudu-confused.webp"; }
    var ph = function (x) { return esc(x).replace(/(block|keep)/, '<span class="pink">$1</span>'); };
    M.innerHTML = '<span class="ghost">' + ph(msg) + '</span><span class="typed"></span>';
    later(function () {
      M.classList.add("show");
      var iv = setInterval(function () {
        k++; $(".typed", M).innerHTML = ph(msg.slice(0, k));
        if (k >= msg.length) { clearInterval(iv); later(function () { $("#res-lower").classList.add("show"); }, 700); }
      }, 55);
      timers.push(iv);
    }, 900);
  }
  function skipToEnd() {
    clearTimers();
    $("#char-bubu").classList.add("in"); $("#char-dudu").classList.add("in");
    finale();
  }

  /* ---------- create-your-own-quiz ---------- */
  function finishCreate() {
    var owner = S.creator.slice(0, D.maxName), key = S.picks.slice();
    var url = location.href.split("#")[0] + "#/q/" + encodeKey(owner, key);
    $("#share-link").textContent = url; $("#share-play").dataset.url = url;
    $("#modal-create").classList.remove("open"); $("#modal-share").classList.add("open");
    show("screen-home");
    S.mode = "play";
  }

  /* ---------- wiring ---------- */
  function init() {
    decodeHash();
    applyOwner();
    renderBoard("#home-board");
<<<<<<< HEAD
    loadBoard();
=======
>>>>>>> f7d9d298f3a7e22f480d973c582fdd3e7256ae37

    // home
    var start = $('[aria-label^="Start"]'); if (start) start.addEventListener("click", function () { openName("play"); });
    var menu = $(".fixed.top-0.right-0"), burger = $(".bg-white.rounded-full.p-3");
    burger.addEventListener("click", function () { menu.classList.remove("translate-x-full"); });
    $('[aria-label="Close menu"]').addEventListener("click", function () { menu.classList.add("translate-x-full"); });
    $$("button", menu).forEach(function (b) { if (/Create My Quiz/.test(b.textContent)) b.addEventListener("click", function () { menu.classList.add("translate-x-full"); openModal(); }); });
    var contact = $('a[href="/contact"]'); if (contact) contact.addEventListener("click", function (e) { e.preventDefault(); toast("contact page isn't part of this clone"); });
    var langBtn = $(".SelectLanguage-module__VZ9K2G__selectorButton"), pop = $("#lang-pop");
    langBtn.addEventListener("click", function (e) { e.stopPropagation(); pop.classList.toggle("open"); });
    document.addEventListener("click", function () { pop.classList.remove("open"); });
    langBtn.parentNode.style.position = "relative"; langBtn.parentNode.appendChild(pop);

    // name
    $("#name-back").addEventListener("click", function () { show(S.mode === "create" ? "screen-home" : "screen-home"); });
    $("#name-input").addEventListener("input", updCount);
    $("#name-input").addEventListener("keydown", function (e) { if (e.key === "Enter") submitName(); });
    $("#name-go").addEventListener("click", submitName);

    // result
    $$(".js-create").forEach(function (b) { b.addEventListener("click", openModal); });

    // modals
    $("#modal-create").addEventListener("click", function (e) { if (e.target === this) closeModal(); });
    $("#modal-create .mx").addEventListener("click", closeModal);
    $("#modal-go").addEventListener("click", function () { closeModal(); openName("create"); });
    $("#modal-share .mx").addEventListener("click", function () { $("#modal-share").classList.remove("open"); });
    $("#modal-share").addEventListener("click", function (e) { if (e.target === this) this.classList.remove("open"); });
    $("#share-copy").addEventListener("click", function () {
      var t = $("#share-link").textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { toast("link copied ✓"); }, function () {
        var r = document.createRange(); r.selectNodeContents($("#share-link")); var s = getSelection(); s.removeAllRanges(); s.addRange(r); toast("select & copy the link");
      });
    });
    $("#share-play").addEventListener("click", function () { location.href = this.dataset.url; location.reload(); });
<<<<<<< HEAD
    $("#res-again").addEventListener("click", function () { show("screen-home"); renderBoard("#home-board"); loadBoard(); });
=======
    $("#res-again").addEventListener("click", function () { show("screen-home"); renderBoard("#home-board"); });
>>>>>>> f7d9d298f3a7e22f480d973c582fdd3e7256ae37
    window.addEventListener("hashchange", function () { location.reload(); });
    show("screen-home");
  }
  function openModal() { $("#modal-create").classList.add("open"); }
  function closeModal() { $("#modal-create").classList.remove("open"); }
  document.addEventListener("DOMContentLoaded", init);
})();
