missing_episodes = {
    server: null,
    metadata_xml: null,

    init: function(metadata_xml, server, type) {
        missing_episodes.server = server;
        missing_episodes.metadata_xml = metadata_xml;

        missing_episodes.insertSwitch();
        if (type === "episodes") {
            missing_episodes.processEpisodes();
        }
        else if (type === "seasons") {
            missing_episodes.processSeasons();
        }
    },

    processEpisodes: function() {
        var directory_metadata = missing_episodes.metadata_xml.getElementsByTagName("MediaContainer")[0].getElementsByTagName("Directory")[0];
        var season_metadata_id = directory_metadata.getAttribute("ratingKey");
        var agent = directory_metadata.getAttribute("guid");
        var season_num = directory_metadata.getAttribute("index");

        /*var tvdb_id;
        // check if using the tvdb metadata agent
        if (/com\.plexapp\.agents\.thetvdb/.test(agent)) {
            tvdb_id = agent.match(/^com\.plexapp\.agents\.thetvdb:\/\/(\d+)\//)[1];
            utils.debug("missing_episodes plugin: tvdb id found - " + tvdb_id);
        }
        // check if using the XBMCnfoTVImporter agent
        else if (/com\.plexapp\.agents\.xbmcnfotv/.test(agent)) {
            tvdb_id = agent.match(/^com\.plexapp\.agents\.xbmcnfotv:\/\/(\d+)\//)[1];
            utils.debug("missing_episodes plugin: tvdb id found - " + tvdb_id);
        }
        else {
            utils.debug("missing_episodes plugin: Agent is not tvdb. Aborting");
            return;
        }*/

        var show_name = document.getElementsByClassName("show-title")[0].textContent.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g,"-");

        // store current page hash so plugin doesn't insert tiles if page changed
        var current_hash = location.hash;

        utils.debug("missing_episodes plugin: Finding all present and all existing episodes");
        missing_episodes.getPresentEpisodes(season_metadata_id, function(present_episodes) {
            trakt_api.getAllEpisodes(show_name, season_num, function(all_episodes) {
                var tiles_to_insert = {};
                for (var i = 0; i < all_episodes.length; i++) {
                    var episode = all_episodes[i];
                    if (present_episodes.indexOf(episode["episode"]) === -1) {
                        var episode_tile = missing_episodes.createEpisodeTile(show_name, episode);
                        tiles_to_insert[episode["number"]] = episode_tile;
                    }
                }

                // check if page changed before inserting tiles
                if (current_hash === location.hash) {
                    missing_episodes.insertEpisodeTiles(tiles_to_insert);
                }
                else {
                    utils.debug("missing_episodes plugin: Page changed before episode tiles could be inserted");
                }
            });
        });
    },

    processSeasons: function() {
        var directory_metadata = missing_episodes.metadata_xml.getElementsByTagName("MediaContainer")[0].getElementsByTagName("Directory")[0];
        var show_metadata_id = directory_metadata.getAttribute("ratingKey");
        var agent = directory_metadata.getAttribute("guid");

        /*var tvdb_id;
        // check if using the tvdb metadata agent
        if (/com\.plexapp\.agents\.thetvdb/.test(agent)) {
            tvdb_id = agent.match(/^com\.plexapp\.agents\.thetvdb:\/\/(\d+)/)[1];
            utils.debug("missing_episodes plugin: tvdb id found - " + tvdb_id);
        }
        // check if using the XBMCnfoTVImporter agent
        else if (/com\.plexapp\.agents\.xbmcnfotv/.test(agent)) {
            tvdb_id = agent.match(/^com\.plexapp\.agents\.xbmcnfotv:\/\/(\d+)/)[1];
            utils.debug("missing_episodes plugin: tvdb id found - " + tvdb_id);
        }
        else {
            utils.debug("missing_episodes plugin: Agent is not tvdb. Aborting");
            return;
        }*/

        var show_name;
        if (trakt.metadata_xml.getElementsByTagName("MediaContainer")[0].getElementsByTagName("Directory")[0].getAttribute("originalTitle") != null) {
            show_name = trakt.metadata_xml.getElementsByTagName("MediaContainer")[0].getElementsByTagName("Directory")[0].getAttribute("originalTitle");
        }
        else {
            show_name = trakt.metadata_xml.getElementsByTagName("MediaContainer")[0].getElementsByTagName("Directory")[0].getAttribute("title");
        }
        show_name = show_name.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g,"-");

        // store current page hash so plugin doesn't insert tiles if page changed
        var current_hash = location.hash;

        utils.debug("missing_episodes plugin: Finding all present and all existing seasons");
        missing_episodes.getPresentSeasons(show_metadata_id, function(present_seasons) {
            trakt_api.getAllSeasons(show_name, function(all_seasons) {
                var tiles_to_insert = {};
                for (var i = 0; i < all_seasons.length; i++) {
                    var season = all_seasons[i];
                    if (present_seasons.indexOf(season["number"]) === -1) {
                        if (season["number"] == 0) {
                            // ignore specials
                            continue;
                        }
                        var season_tile = missing_episodes.createSeasonTile(show_name,season);
                        tiles_to_insert[season["number"]] = season_tile;
                    }
                }

                // check if page changed before inserting tiles
                if (current_hash === location.hash) {
                    missing_episodes.insertSeasonTiles(tiles_to_insert);
                    // 20150803 - v2 API for trakt.tv does not appear to give air dates like before
                    // Fetch season air dates and insert them into tiles
                    // missing_episodes.insertSeasonAirdates(tvdb_id, tiles_to_insert);
                }
                else {
                    utils.debug("missing_episodes plugin: Page changed before season tiles could be inserted");
                }
            });
        });
    },

    getPresentEpisodes: function(season_metadata_id, callback) {
        utils.debug("missing_episodes plugin: Fetching season episodes xml");
        var episodes_metadata_xml_url = missing_episodes.server["uri"] + "/library/metadata/" + season_metadata_id + "/children?X-Plex-Token=" + missing_episodes.server["access_token"];
        utils.getXML(episodes_metadata_xml_url, function(episodes_metadata_xml) {
            var episodes_xml = episodes_metadata_xml.getElementsByTagName("MediaContainer")[0].getElementsByTagName("Video");
            var episodes = [];
            for (var i = 0; i < episodes_xml.length; i++) {
                episodes.push(parseInt(episodes_xml[i].getAttribute("index")));
            }
            callback(episodes);
        });
    },

    getPresentSeasons: function(show_metadata_id, callback) {
        utils.debug("missing_episodes plugin: Fetching seasons xml");
        var seasons_metadata_xml_url = missing_episodes.server["uri"] + "/library/metadata/" + show_metadata_id + "/children?X-Plex-Token=" + missing_episodes.server["access_token"];
        utils.getXML(seasons_metadata_xml_url, function(seasons_metadata_xml) {
            var seasons_xml = seasons_metadata_xml.getElementsByTagName("MediaContainer")[0].getElementsByTagName("Directory");
            var seasons = [];
            for (var i = 0; i < seasons_xml.length; i++) {
                var season_index = parseInt(seasons_xml[i].getAttribute("index"));
                if (!isNaN(season_index)) {
                    seasons.push(season_index);
                }
            }
            callback(seasons);
        });
    },

    createEpisodeTile: function(show_name, episode) {
        var episode_tile = document.createElement("li");
        episode_tile.setAttribute("class", "poster-item media-tile-list-item episode missing-episode");

        var episode_tile_link = document.createElement("a");
        episode_tile_link.setAttribute("class", "media-poster-container");
        episode_tile_link.setAttribute("href", "https://trakt.tv/shows/" + show_name + "/seasons/" + episode["season"] + "/episodes/" + episode["number"]);
        episode_tile_link.setAttribute("target", "_blank");

        var episode_tile_poster = document.createElement("div");
        episode_tile_poster.setAttribute("class", "media-poster");
        episode_tile_poster.setAttribute("style", "background-image: url(" + (episode["screen"] || utils.getResourcePath("trakt/trakt_episode_background.png")) + ");");

        var episode_tile_overlay = document.createElement("div");
        episode_tile_overlay.setAttribute("class", "media-poster-overlay-missing-episode");

        var episode_title_overlay_text = document.createElement("div");
        episode_title_overlay_text.setAttribute("class", "overlay-missing-episode-text");
        // 20150803 - v2 API for trakt.tv does not appear to give air dates like before
        /*var date_text;
        if (episode["first_aired_utc"] === 0 || episode["first_aired_utc"] === null) {
            date_text = "TBA";
        }
        else {
            var local_utc_offset = new Date().getTimezoneOffset() * 60000;
            var utc_air_date = episode["first_aired_utc"] * 1000;
            var localized_air_date = new Date(utc_air_date - local_utc_offset);
            date_text = localized_air_date.toDateString();
        }
        var episode_title_overlay_text_node = document.createTextNode("Air Date: " + date_text);
        episode_title_overlay_text.appendChild(episode_title_overlay_text_node);*/

        var episode_tile_title = document.createElement("div");
        episode_tile_title.setAttribute("class", "media-title media-heading");
        var episode_tile_title_text_node = document.createTextNode(episode["title"] || "TBA");
        episode_tile_title.appendChild(episode_tile_title_text_node);

        var episode_tile_number = document.createElement("div");
        episode_tile_number.setAttribute("class", "media-subtitle media-heading secondary");
        var episode_tile_number_text_node = document.createTextNode("Episode " + episode["number"]);
        episode_tile_number.appendChild(episode_tile_number_text_node);

        episode_tile.appendChild(episode_tile_link);
        episode_tile_link.appendChild(episode_tile_poster);
        episode_tile_link.appendChild(episode_tile_title);
        episode_tile_link.appendChild(episode_tile_number);
        episode_tile_poster.appendChild(episode_tile_overlay);
        episode_tile_overlay.appendChild(episode_title_overlay_text);

        return episode_tile;
    },

    createSeasonTile: function(show_name, season) {
        var season_tile = document.createElement("li");
        season_tile.setAttribute("class", "poster-item media-tile-list-item season missing-season");

        var season_tile_link = document.createElement("a");
        season_tile_link.setAttribute("class", "media-poster-container");
        season_tile_link.setAttribute("href", "https://trakt.tv/shows/" + show_name + "/seasons/" + season["number"]);
        season_tile_link.setAttribute("target", "_blank");

        var season_tile_poster = document.createElement("div");
        season_tile_poster.setAttribute("class", "media-poster");
        season_tile_poster.setAttribute("style", "background-image: url(" + (season["poster"] || utils.getResourcePath("trakt/trakt_season_background.png")) + ");");

        var season_tile_overlay = document.createElement("div");
        season_tile_overlay.setAttribute("class", "media-poster-overlay-missing-season");

        var season_title_overlay_text = document.createElement("div");
        season_title_overlay_text.setAttribute("class", "overlay-missing-season-text");

        var season_tile_title = document.createElement("div");
        season_tile_title.setAttribute("class", "media-title media-heading");
        var season_tile_title_text_node = document.createTextNode("Season " + season["number"]);
        season_tile_title.appendChild(season_tile_title_text_node);

        var season_tile_number = document.createElement("div");
        season_tile_number.setAttribute("class", "media-subtitle media-heading secondary");
        var season_tile_number_text_node = document.createTextNode(season["episodes"].length + " episodes");
        season_tile_number.appendChild(season_tile_number_text_node);

        season_tile.appendChild(season_tile_link);
        season_tile_link.appendChild(season_tile_poster);
        season_tile_link.appendChild(season_tile_title);
        season_tile_link.appendChild(season_tile_number);
        season_tile_poster.appendChild(season_tile_overlay);
        season_tile_overlay.appendChild(season_title_overlay_text);

        return season_tile;
    },

    insertEpisodeTiles: function(episode_tiles) {
        var episode_tile_list = document.getElementsByClassName("episode-tile-list")[0];
        var episode_tile_list_elements = episode_tile_list.getElementsByTagName("li");

        // remove episode tile list node first
        var parent_node = episode_tile_list.parentNode;
        parent_node.removeChild(episode_tile_list);

        // insert already present episodes into episode_tiles array
        for (var i = 0; i < episode_tile_list_elements.length; i++) {
            var episode_num = episode_tile_list_elements[i].getElementsByClassName("media-heading secondary")[0].innerHTML.match(/\d+/);
            episode_tiles[episode_num] = episode_tile_list_elements[i];
        }

        // iterate over all episode tiles, present and missing, to reinsert back into episode tile list in order
        var j = 0;
        for (var episode_number in episode_tiles) {
            var episode_tile = episode_tiles[episode_number];

            episode_tile_list.insertBefore(episode_tile, episode_tile_list_elements[j]);
            j++;
        }

        // reinsert episode tile list node
        parent_node.appendChild(episode_tile_list);
    },

    insertSeasonTiles: function(season_tiles) {
        var season_tile_list = document.getElementsByClassName("season-tile-list")[0];
        var season_tile_list_elements = season_tile_list.getElementsByTagName("li");

        // remove season tile list node first
        var parent_node = season_tile_list.parentNode;
        parent_node.removeChild(season_tile_list);

        // insert already present seasons into season_tiles array
        for (var i = 0; i < season_tile_list_elements.length; i++) {
            var season_num = season_tile_list_elements[i].getElementsByClassName("media-title media-heading")[0].innerHTML.match(/\d+/);

            if (season_num) {
                season_tiles[season_num] = season_tile_list_elements[i];
            }
            else {
                season_tiles["specials"] = season_tile_list_elements[i];
            }
        }

        // iterate over all season tiles, present and missing, to reinsert back into season tile list in order
        var j = 0;
        for (var season_number in season_tiles) {
            var season_tile = season_tiles[season_number];

            // Stick specials season first
            if (season_number === "specials") {
                season_tile_list.insertBefore(season_tile, season_tile_list_elements[0]);
            }
            else {
                season_tile_list.insertBefore(season_tile, season_tile_list_elements[j]);
                j++;
            }
        }

        // reinsert season tile list node
        parent_node.appendChild(season_tile_list);
    },

    insertSeasonAirdates: function(tvdb_id, season_tiles) {
        // TODO: Unused with new trakt.tv API
        Object.keys(season_tiles).forEach(function (season_number) {
            var season_tile = season_tiles[season_number];

            // skip if not missing season
            if (!season_tiles[season_number].classList.contains("missing-season")) {
                return;
            }

            trakt_api.getAllEpisodes(tvdb_id, season_number, function(all_episodes) {
                var first_episode = all_episodes[0];

                var date_text;
                if (first_episode["first_aired_utc"] === 0 || first_episode["first_aired_utc"] === null) {
                    date_text = "TBA";
                }
                else {
                    var local_utc_offset = new Date().getTimezoneOffset() * 60000;
                    var utc_air_date = first_episode["first_aired_utc"] * 1000;
                    var localized_air_date = new Date(utc_air_date - local_utc_offset);
                    date_text = localized_air_date.toDateString();
                }

                var overlay_text_element_text_node = document.createTextNode("Air Date:");
                var overlay_text_element_linebreak = document.createElement("br");
                var overlay_text_element_date_text_node = document.createTextNode(date_text);

                var overlay_text_element = season_tile.getElementsByClassName("overlay-missing-season-text")[0];
                overlay_text_element.appendChild(overlay_text_element_text_node);
                overlay_text_element.appendChild(overlay_text_element_linebreak);
                overlay_text_element.appendChild(overlay_text_element_date_text_node);
            });
        });
    },

    insertSwitch: function() {
        var action_bar = document.getElementsByClassName("action-bar-nav")[0];
        var list_tag = document.createElement("li");

        var a_tag = document.createElement("a");
        a_tag.setAttribute("class", "btn-gray");
        a_tag.setAttribute("id", "missing-switch");

        var glyph = document.createElement("i");
        glyph.setAttribute("class", "glyphicon eye-open");

        a_tag.appendChild(glyph);
        list_tag.appendChild(a_tag);
        // insert switch before secondary actions dropdown
        action_bar.insertBefore(list_tag, action_bar.getElementsByClassName("secondary-actions-dropdown")[0]);

        a_tag.setAttribute("data-state", "show");
        a_tag.setAttribute("data-original-title", "Hide missing episodes/seasons");
        a_tag.addEventListener("click", missing_episodes.switchState, false);
    },

    switchState: function() {
        var missing_switch = document.getElementById("missing-switch");
        var glyph = missing_switch.getElementsByTagName("i")[0];
        var state = missing_switch.getAttribute("data-state");

        var missing_episodes = document.getElementsByClassName("missing-episode");
        for (var i = 0; i < missing_episodes.length; i++) {
            if (state === "show") {
                missing_episodes[i].style.display = "none";
            }
            else {
                missing_episodes[i].style.display = "block";
            }
        }

        var missing_seasons = document.getElementsByClassName("missing-season");
        for (var i = 0; i < missing_seasons.length; i++) {
            if (state === "show") {
                missing_seasons[i].style.display = "none";
            }
            else {
                missing_seasons[i].style.display = "block";
            }
        }

        if (state === "show") {
            glyph.setAttribute("class", "glyphicon eye-close");
            missing_switch.setAttribute("data-state", "hide");
            missing_switch.setAttribute("data-original-title", "Show missing episodes/seasons");
        }
        else {
            glyph.setAttribute("class", "glyphicon eye-open");
            missing_switch.setAttribute("data-state", "show");
            missing_switch.setAttribute("data-original-title", "Hide missing episodes/seasons");
        }
    }
}