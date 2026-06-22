(function () {
  var THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  function parseNewsDate(dateString) {
    return new Date(dateString + "T00:00:00");
  }

  function isHotNews(itemDate, now) {
    var publishedAt = parseNewsDate(itemDate);
    var diff = now.getTime() - publishedAt.getTime();
    return diff >= 0 && diff <= THIRTY_DAYS_MS;
  }

  function renderHotBadge(item, now) {
    if (!isHotNews(item.date, now)) return "";
    return ' <span class="news-hot" aria-label="Recent news in the last 30 days" title="Recent news in the last 30 days">火</span>';
  }

  function renderNewsList(container, items, now) {
    if (!container) return;

    if (!items.length) {
      container.innerHTML = "<li>No news items available.</li>";
      return;
    }

    container.innerHTML = items.map(function (item) {
      return '<li><span class="news-date">' + item.date + ':</span> ' + item.html + renderHotBadge(item, now) + "</li>";
    }).join("");
  }

  function renderNewsByYear(container, items, now) {
    if (!container) return;

    if (!items.length) {
      container.innerHTML = "<p>No news items available.</p>";
      return;
    }

    var groups = items.reduce(function (acc, item) {
      var year = item.date.slice(0, 4);
      if (!acc[year]) acc[year] = [];
      acc[year].push(item);
      return acc;
    }, {});

    var years = Object.keys(groups).sort(function (a, b) {
      return Number(b) - Number(a);
    });

    container.innerHTML = years.map(function (year) {
      var list = groups[year].map(function (item) {
        return '<li><span class="news-date">' + item.date + ':</span> ' + item.html + renderHotBadge(item, now) + "</li>";
      }).join("");

      return '<section class="card paper-year"><h2>' + year + '</h2><ul class="news-list">' + list + "</ul></section>";
    }).join("");
  }

  function getRecentNews(items) {
    var currentYear = new Date().getFullYear();
    var cutoffYear = currentYear - 1;

    return items.filter(function (item) {
      return Number(item.date.slice(0, 4)) >= cutoffYear;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var items = Array.isArray(window.siteNews) ? window.siteNews.slice() : [];
    var now = new Date();

    items.sort(function (a, b) {
      return parseNewsDate(b.date) - parseNewsDate(a.date);
    });

    var fullNews = document.querySelector("[data-news-list='full']");
    var recentNews = document.querySelector("[data-news-list='recent']");
    var groupedNews = document.querySelector("[data-news-list='grouped']");

    if (fullNews) {
      renderNewsList(fullNews, items, now);
    }

    if (groupedNews) {
      renderNewsByYear(groupedNews, items, now);
    }

    if (recentNews) {
      renderNewsList(recentNews, getRecentNews(items), now);
    }
  });
})();
