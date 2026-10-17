(() => {
  const inputs = document.querySelectorAll('#gate input');
  let activeInput = null;
  let scrollTimers = [];

  function scrollToBottom() {
    if (!activeInput) return;

    // Браузер сам ограничит прокрутку максимально доступным положением.
    const pageHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );

    window.scrollTo({
      top: pageHeight,
      behavior: "auto"
    });
  }

  function scheduleBottomScroll() {
    // Клавиатура появляется не мгновенно, поэтому повторяем прокрутку.
    scrollTimers.forEach(clearTimeout);
    scrollTimers = [100, 300, 600, 1000].map(delay =>
      setTimeout(scrollToBottom, delay)
    );
  }

  inputs.forEach(input => {
    input.addEventListener("focus", () => {
      activeInput = input;
      scheduleBottomScroll();
    });

    input.addEventListener("blur", () => {
      if (activeInput === input) activeInput = null;
      scrollTimers.forEach(clearTimeout);
      scrollTimers = [];
    });
  });

  // Повторно прокручиваем вниз, когда меняется видимая область из-за клавиатуры.
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", scheduleBottomScroll);
  }

  window.addEventListener("resize", scheduleBottomScroll);

  // Независимые случайные глитч-полосы поверх страницы.
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const layer = document.createElement("div");
    layer.className = "glitch-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    function spawnGlitch() {
      // Иногда возникает короткая группа из нескольких полос.
      const count = Math.random() < 0.22 ? 2 + Math.floor(Math.random() * 3) : 1;

      for (let i = 0; i < count; i++) {
        const strip = document.createElement("span");
        const colors = ["", "red", "green"];
        strip.className = "glitch-strip " + colors[Math.floor(Math.random() * colors.length)];
        strip.style.setProperty("--strip-top", (Math.random() * 100).toFixed(2) + "%");
        strip.style.setProperty("--strip-left", (Math.random() * 70).toFixed(2) + "%");
        strip.style.setProperty("--strip-width", (8 + Math.random() * 82).toFixed(2) + "%");
        strip.style.setProperty("--strip-height", (1 + Math.random() * 5).toFixed(1) + "px");
        strip.style.setProperty("--strip-shift", (-8 + Math.random() * 16).toFixed(1) + "px");
        strip.style.setProperty("--strip-duration", (65 + Math.random() * 130).toFixed(0) + "ms");
        layer.appendChild(strip);
        strip.addEventListener("animationend", () => strip.remove(), { once: true });
      }

      // Нерегулярные паузы, чтобы эффект не выглядел цикличным.
      window.setTimeout(spawnGlitch, 180 + Math.random() * 1100);
    }

    window.setTimeout(spawnGlitch, 350 + Math.random() * 900);
  }

})();