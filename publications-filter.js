(function () {
  function updateButtonState(buttons, attributeName, value) {
    buttons.forEach(function (button) {
      var isActive = button.getAttribute(attributeName) === value;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function updateFilter(topicButtons, yearButtons, sections, topic, year) {
    updateButtonState(topicButtons, "data-topic", topic);
    updateButtonState(yearButtons, "data-year", year);

    sections.forEach(function (section) {
      var items = Array.from(section.querySelectorAll(".paper-list li"));
      var visibleCount = 0;
      var sectionYear = section.getAttribute("data-year");
      var yearMatches = year === "all" || sectionYear === year;

      items.forEach(function (item) {
        var itemTopics = (item.getAttribute("data-topics") || "").split(" ").filter(Boolean);
        var topicMatches = topic === "all" || itemTopics.indexOf(topic) !== -1;
        var visible = yearMatches && topicMatches;
        item.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      section.hidden = visibleCount === 0;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var topicButtons = Array.from(document.querySelectorAll(".topic-filter"));
    var yearButtons = Array.from(document.querySelectorAll(".year-filter"));
    var sections = Array.from(document.querySelectorAll(".paper-year"));
    var state = {
      topic: "all",
      year: "all"
    };

    if (!topicButtons.length || !yearButtons.length || !sections.length) return;

    topicButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        state.topic = button.getAttribute("data-topic");
        updateFilter(topicButtons, yearButtons, sections, state.topic, state.year);
      });
    });

    yearButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        state.year = button.getAttribute("data-year");
        updateFilter(topicButtons, yearButtons, sections, state.topic, state.year);
      });
    });
  });
})();
