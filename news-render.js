(function () {
  function parseNewsDate(dateString) {
    return new Date(dateString + "T00:00:00");
  }

  function renderNewsList(container, items) {
    if (!container) return;

    if (!items.length) {
      container.innerHTML = "<li>No news items available.</li>";
      return;
    }

    container.innerHTML = items.map(function (item) {
      return '<li><span class="news-date">' + item.date + ':</span> ' + item.html + "</li>";
    }).join("");
  }

  function getRecentNews(items) {
    var now = new Date();
    var cutoff = new Date(now);
    cutoff.setFullYear(cutoff.getFullYear() - 2);

    return items.filter(function (item) {
      return parseNewsDate(item.date) >= cutoff;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var items = Array.isArray(window.siteNews) ? window.siteNews.slice() : [];

    items.sort(function (a, b) {
      return parseNewsDate(b.date) - parseNewsDate(a.date);
    });

    var fullNews = document.querySelector("[data-news-list='full']");
    var recentNews = document.querySelector("[data-news-list='recent']");

    if (fullNews) {
      renderNewsList(fullNews, items);
    }

    if (recentNews) {
      renderNewsList(recentNews, getRecentNews(items));
    }
  });
})();
