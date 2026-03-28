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

  function renderNewsByYear(container, items) {
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
        return '<li><span class="news-date">' + item.date + ':</span> ' + item.html + "</li>";
      }).join("");

      return '<section class="card paper-year"><h2>' + year + '</h2><ul class="news-list">' + list + "</ul></section>";
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
    var groupedNews = document.querySelector("[data-news-list='grouped']");

    if (fullNews) {
      renderNewsList(fullNews, items);
    }

    if (groupedNews) {
      renderNewsByYear(groupedNews, items);
    }

    if (recentNews) {
      renderNewsList(recentNews, getRecentNews(items));
    }
  });
})();
