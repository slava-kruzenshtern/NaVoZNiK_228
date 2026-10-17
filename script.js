(() => {
  const inputs = document.querySelectorAll('#gate input');
  let activeInput = null;

  function alignInputToTop() {
    if (!activeInput) return;

    const top = activeInput.getBoundingClientRect().top;
    window.scrollTo({
      top: window.scrollY + top - 8,
      behavior: "auto"
    });
  }

  inputs.forEach(input => {
    input.addEventListener("focus", () => {
      activeInput = input;

      // Даём мобильной клавиатуре открыться, затем выравниваем поле.
      setTimeout(alignInputToTop, 300);
      setTimeout(alignInputToTop, 650);
    });

    input.addEventListener("blur", () => {
      if (activeInput === input) activeInput = null;
    });
  });

  // На телефонах высота видимой области меняется при появлении клавиатуры.
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
      if (activeInput) setTimeout(alignInputToTop, 100);
    });
  }
})();
