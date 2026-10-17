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
})();
