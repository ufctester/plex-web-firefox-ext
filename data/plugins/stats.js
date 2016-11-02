stats = {
    init: function() {
        if (document.getElementById("stats-page-link")) {
            utils.debug("Stats plugin: Link already exists. Passing");
            return;
        }

        var nav_bar_right = document.body.getElementsByClassName("nav-bar-right")[0];

        var list_element = document.createElement("li");

        var stats_link = document.createElement("a");
        stats_link.setAttribute("id", "stats-page-link");
        stats_link.setAttribute("title", "Transmogrify for Plex stats");
        stats_link.setAttribute("href", utils.getStatsURL());
        stats_link.setAttribute("target", "_blank");

        var stats_glyph = document.createElement("i");
        stats_glyph.setAttribute("class", "glyphicon charts");

        stats_link.appendChild(stats_glyph);
        list_element.appendChild(stats_link);

        nav_bar_right.insertBefore(list_element, nav_bar_right.firstChild);

        // event handler for firefox to open stats page
        var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (is_firefox) {
            try {
                stats_link.addEventListener("click", utils.openStatsPage, false);
            }
            catch(e) {
            }
        }
    }
}