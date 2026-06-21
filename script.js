/* ============================================================
   Knight Chess Helper — site script
   Board + best-move arrow · eval bar · reveals · EN/RU i18n
   ============================================================ */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- board (Two Knights Defense) ---------- */
  var FEN = "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R";
  var GLYPH = { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" };

  function renderBoard() {
    var board = document.getElementById("board");
    if (!board) return;
    var rows = FEN.split("/"), frag = document.createDocumentFragment();
    for (var r = 0; r < 8; r++) {
      var rank = rows[r], col = 0;
      for (var i = 0; i < rank.length; i++) {
        var ch = rank[i];
        if (/\d/.test(ch)) { for (var e = 0, n = +ch; e < n; e++) { frag.appendChild(sq(r, col)); col++; } }
        else {
          var s = sq(r, col), p = document.createElement("span");
          p.className = "pc " + (ch === ch.toUpperCase() ? "pc--w" : "pc--b");
          p.textContent = GLYPH[ch.toLowerCase()];
          s.appendChild(p); frag.appendChild(s); col++;
        }
      }
    }
    board.appendChild(frag);
  }
  function sq(r, c) { var d = document.createElement("div"); d.className = "sq " + ((r + c) % 2 === 0 ? "sq--l" : "sq--d"); return d; }

  /* ---------- best-move arrow Nf3 -> g5 (knight L) ---------- */
  function drawArrow() {
    var svg = document.getElementById("boardArrow");
    if (!svg) return;
    var NS = "http://www.w3.org/2000/svg";
    var line = document.createElementNS(NS, "path");
    line.setAttribute("d", "M5.5 5.5 L5.5 3.5 L6.18 3.5");
    var head = document.createElementNS(NS, "polygon");
    head.setAttribute("class", "ah");
    head.setAttribute("points", "6.05,3.16 6.05,3.84 6.62,3.5");
    svg.appendChild(line); svg.appendChild(head);
    if (reduceMotion) return;
    var len = line.getTotalLength();
    line.style.strokeDasharray = len; line.style.strokeDashoffset = len; head.style.opacity = "0";
    line.getBoundingClientRect();
    line.style.transition = "stroke-dashoffset 1s cubic-bezier(.22,.7,.2,1)";
    head.style.transition = "opacity .35s ease .8s";
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      line.style.strokeDashoffset = "0"; head.style.opacity = ".95";
    }); });
  }

  /* ---------- eval bar fill ---------- */
  function fillEval() {
    var w = document.getElementById("evalWhite");
    if (!w) return;
    if (reduceMotion) { w.style.height = "56%"; return; }
    requestAnimationFrame(function () { requestAnimationFrame(function () { w.style.height = "56%"; }); });
  }

  /* ---------- reveals ---------- */
  function setupReveals() {
    var els = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- i18n (EN in DOM, RU here) ---------- */
  var I18N = { en: {}, ru: {
    "skip": "К содержанию",
    "nav.features": "Возможности", "nav.how": "Как работает", "nav.look": "Поближе", "nav.install": "Установка", "nav.github": "GitHub",

    "hero.pill": "Локальный Stockfish для Chess.com",
    "hero.title": "Шахматный движок, который живёт на твоей доске.",
    "hero.lead": "Knight встраивает приватный движок Stockfish прямо в Chess.com — живая оценка, подсказки лучших ходов и дебютная теория, всё считается на твоём компьютере.",
    "hero.install": "Установить Knight", "hero.source": "Открыть на GitHub",
    "meta.local": "100% локально", "meta.open": "Открытый код · MIT",

    "strip.engine": "Stockfish на WebAssembly", "strip.offline": "Работает офлайн",
    "strip.private": "Без аккаунтов и телеметрии", "strip.lang": "Английский и русский",

    "feat.kicker": "Возможности",
    "feat.title": "Всё нужное — прямо на доске.",
    "feat.intro": "Полноценный помощник для анализа, который рисует прямо в Chess.com — без вкладок, копипаста и ожидания.",

    "card.local.h": "Локально и приватно по умолчанию",
    "card.local.p": "Stockfish работает как WebAssembly-воркер на твоём железе. Никаких серверов, аккаунтов и данных, покидающих браузер.",
    "chip.noserver": "Без серверов", "chip.noaccount": "Без аккаунтов", "chip.notelemetry": "Без телеметрии",

    "card.hint.h": "Подсказки лучшего хода — нарисованы за тебя",
    "card.hint.p": "Движок рисует свой главный ход прямо на доске — здесь конь прыгает на g5.",

    "card.eval.h": "Сила позиции",
    "card.eval.p": "Живая шкала читает позицию в сотых пешки — ты всегда знаешь, кто лучше стоит.",

    "card.book.h": "Дебютная книга",
    "card.book.p": "Knight узнаёт известные линии и называет теорию по ходу партии.",

    "card.stats.h": "Статистика партий",
    "card.stats.p": "Отслеживай игры со временем и замечай закономерности своей игры.",

    "card.theme.h": "Светлая и тёмная темы",
    "card.theme.p": "Аккуратно ложатся поверх Chess.com в любое время суток.",

    "card.lang.h": "Английский и русский",
    "card.lang.p": "Интерфейс полностью говорит на обоих языках — переключай когда угодно, в том числе на этой странице.",

    "how.kicker": "Под капотом",
    "how.title": "Чистый конвейер на Manifest V3.",
    "how.intro": "Контент-скрипты читают доску и рисуют на ней, фоновый воркер маршрутизирует запросы, а offscreen-документ запускает движок.",
    "how.s1.h": "Доска", "how.s1.p": "Контент-скрипты читают живую позицию и рисуют подсказки на доске.",
    "how.s2.h": "Service worker", "how.s2.p": "Фоновый воркер координирует сообщения и запросы к движку.",
    "how.s3.h": "Offscreen-движок", "how.s3.p": "Offscreen-документ держит воркер Stockfish на WebAssembly.",
    "how.s4.h": "Оценка", "how.s4.p": "Оценка и лучший ход возвращаются и рисуются обратно на доску.",

    "look.kicker": "Поближе",
    "look.title": "Настрой под свою игру.",
    "look.intro": "Одна панель, разумно устроенная. Выбери тему и язык, задай ELO-профиль — остальное сделает движок.",
    "look.t1": "Тёмная или светлая тема", "look.t2": "Английский или русский интерфейс",
    "look.t3": "ELO-профиль от новичка до клубного игрока", "look.t4": "Человекоподобный тайминг",

    "install.kicker": "Установка",
    "install.title": "Готово к работе за минуту.",
    "install.intro": "Knight поставляется как распакованное расширение для браузеров на Chromium — Chrome, Edge, Brave. Поддержка Firefox экспериментальная.",
    "install.s1": "Скачай последний релиз с GitHub.",
    "install.s2": "Распакуй в постоянную папку.",
    "install.s3": "Открой страницу расширений и включи режим разработчика.",
    "install.s4": "Нажми «Загрузить распакованное» и выбери папку.",
    "install.s5": "Открой Chess.com — Knight уже на доске.",

    "cta.title": "Верни движок на свою доску.",
    "cta.sub": "Бесплатно, с открытым кодом и полностью локально. Установи Knight и изучай шахматы умнее.",
    "cta.install": "Установить Knight", "cta.star": "Звезда на GitHub",
    "cta.use": "Создан для анализа, изучения и разбора — пожалуйста, не используй его для нечестного преимущества в живых партиях.",

    "foot.repo": "Репозиторий", "foot.releases": "Релизы", "foot.issues": "Issues", "foot.license": "Лицензия",
    "foot.fine1": "Работает на Stockfish (GPLv3). Knight под лицензией MIT.",
    "foot.fine2": "Не связан с Chess.com.",

    "cmp.kicker": "Почему локально",
    "cmp.title": "Твоё, а не облака.",
    "cmp.intro": "Большинство «помощников» отправляют твои партии на чей-то сервер. Knight держит всё на твоём компьютере.",
    "cmp.other": "Облачные помощники",
    "cmp.r1": "Работает на твоём устройстве",
    "cmp.r2": "Полностью работает офлайн",
    "cmp.r3": "Без регистрации и аккаунта",
    "cmp.r4": "Исходный код можно прочитать",
    "cmp.r5": "Бесплатно, без ограничений",
    "cmp.r6": "Данные остаются у тебя",

    "faq.kicker": "FAQ",
    "faq.title": "Отвечаем на вопросы.",
    "faq.q1": "Knight бесплатный?",
    "faq.a1": "Да — Knight бесплатный и с открытым кодом под лицензией MIT. Можно читать, собирать и менять каждую строку.",
    "faq.q2": "Он правда работает локально?",
    "faq.a2": "Полностью. Stockfish скомпилирован в WebAssembly и работает в браузере. После установки анализ работает без интернета, и ничего не отправляется на сервер.",
    "faq.q3": "Это разрешено на Chess.com?",
    "faq.a3": "Knight создан для анализа, изучения и разбора партий. Пожалуйста, не используй его для нечестного преимущества в живых партиях против людей — это нарушает правила Chess.com и не то, для чего он сделан.",
    "faq.q4": "Какие браузеры поддерживаются?",
    "faq.a4": "Любой на Chromium — Chrome, Edge, Brave. Поддержка Firefox пока экспериментальная.",
    "faq.q5": "Он замедлит браузер?",
    "faq.a5": "Движок работает в отдельном offscreen-воркере, поэтому страница остаётся отзывчивой. Силу и тайминг можно настроить в настройках.",
    "faq.q6": "Как его обновлять?",
    "faq.a6": "Скачай новый релиз, замени папку и нажми «Обновить» на странице расширений. Настройки сохранятся."
  } };

  function captureEnglish() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) { I18N.en[el.getAttribute("data-i18n")] = el.textContent; });
  }
  function applyLang(lang) {
    var dict = I18N[lang] || I18N.en;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n"); if (dict[k] != null) el.textContent = dict[k];
    });
    document.documentElement.lang = lang;
    document.querySelectorAll(".lang__opt").forEach(function (o) { o.classList.toggle("is-active", o.getAttribute("data-lang") === lang); });
    try { localStorage.setItem("knight-lang", lang); } catch (e) {}
  }
  function setupLang() {
    captureEnglish();
    var saved = null; try { saved = localStorage.getItem("knight-lang"); } catch (e) {}
    if (!saved) saved = (navigator.language || "").slice(0, 2) === "ru" ? "ru" : "en";
    if (saved === "ru") applyLang("ru");
    var btn = document.getElementById("langToggle");
    if (btn) btn.addEventListener("click", function () { applyLang(document.documentElement.lang === "ru" ? "en" : "ru"); });
  }

  /* ---------- live GitHub stars ---------- */
  function ghStars() {
    var el = document.getElementById("ghStars");
    if (!el) return;
    fetch("https://api.github.com/repos/physicalaff/Knight-Chess-Helper")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || typeof d.stargazers_count !== "number") return;
        var n = d.stargazers_count;
        el.classList.add("in");
        if (reduceMotion) { el.textContent = "★ " + n; return; }
        var t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / 900);
          el.textContent = "★ " + Math.round(n * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      })
      .catch(function () {});
  }

  /* ---------- product-shot mouse tilt ---------- */
  function tilt() {
    var fig = document.querySelector(".hero__shot");
    var img = document.querySelector(".shot__img");
    if (!fig || !img || reduceMotion || window.matchMedia("(hover: none)").matches) return;
    fig.addEventListener("pointermove", function (e) {
      var r = fig.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      img.style.transform = "rotateY(" + (x * 9).toFixed(2) + "deg) rotateX(" + (-y * 9).toFixed(2) + "deg)";
    });
    fig.addEventListener("pointerleave", function () { img.style.transform = ""; });
  }

  /* ---------- cursor-follow spotlight on cards ---------- */
  function spotlight() {
    if (reduceMotion) return;
    document.querySelectorAll(".card").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        c.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      });
    });
  }

  function init() { renderBoard(); drawArrow(); fillEval(); setupReveals(); setupLang(); ghStars(); tilt(); spotlight(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
