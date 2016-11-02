// movie charts
function drawMovieYearsChart(year_data) {
    var x_labels = ["x"];
    var y_data = ["Count"];
    for (var year in year_data) {
        x_labels.push(year);
        y_data.push(year_data[year]);
    }

    var chart = c3.generate({
        bindto: "#movie-year-chart",
        data: {
            x: "x",
            type: "bar",
            columns: [
                x_labels,
                y_data,
            ],
            color: function(color, d) {
                return "#FF9900";
            }
        },
        bar: {
            width: {
                ratio: 0.7
            }
        },
        axis: {
            x: {
                type: "number",
                label: {
                    text: "Year",
                    position: "outer-center"
                }
            },
            y: {
                label: {
                    text: "Number of Movies",
                    position: "outer-middle"
                }
            }
        },
        grid: {
            x: {
                show: false
            },
            y: {
                show: true
            }
        },
        legend: {
            show: false
        }
    });
}

function drawMovieGenreChart(genre_data) {
    var show_legend = true;
    if (Object.keys(genre_data).length > 52) {
        show_legend = false;
    }

    var chart = c3.generate({
        bindto: "#movie-genre-chart",
        data: {
            json: genre_data,
            type: "donut"
        },
        donut: {
            label: {
                format: function(value, ratio, id) {
                    return id;
                }
            },
            width: 140
        },
        legend: {
            show: show_legend,
            position: "right"
        },
        tooltip: {
            format: {
                value: function(value, ratio, id) {
                    var format = d3.format(".1%");
                    return value + " Movies (" + format(ratio) + ")";
                }
            }
        }
    });
}

function drawMovieRatingChart(rating_data) {
    var chart = c3.generate({
        bindto: "#movie-rating-chart",
        data: {
            json: rating_data,
            type: "donut"
        },
        donut: {
            label: {
                format: function(value, ratio, id) {
                    return id;
                }
            },
            width: 140
        },
        legend: {
            position: "right"
        },
        tooltip: {
            format: {
                value: function(value, ratio, id) {
                    var format = d3.format(".1%");
                    return value + " Movies (" + format(ratio) + ")";
                }
            }
        }
    });
}

function drawMovieDateAddedChart(date_data) {
    var x_labels = ["x"];
    var y_data = ["Total Count"];
    for (var date in date_data) {
        x_labels.push(date);
        y_data.push(date_data[date]);
    }

    var chart = c3.generate({
        bindto: "#movie-date-added-chart",
        data: {
            x: "x",
            type: "area",
            columns: [
                x_labels,
                y_data,
            ],
            color: function(color, d) {
                return "#109618";
            }
        },
        axis: {
            x: {
                type: "timeseries",
                label: {
                    text: "Date",
                    position: "outer-center"
                },
                tick: {
                    format: "%Y-%m-%d",
                    fit: false
                }
            },
            y: {
                label: {
                    text: "Total Number of Movies",
                    position: "outer-middle"
                }
            }
        },
        grid: {
            y: {
                show: true
            }
        },
        legend: {
            show: false
        }
    });
}

function drawMovieContentRatingChart(content_rating_data) {
    var chart = c3.generate({
        bindto: "#movie-content-rating-chart",
        data: {
            json: content_rating_data,
            type: "donut"
        },
        donut: {
            label: {
                format: function(value, ratio, id) {
                    return id;
                }
            },
            width: 140
        },
        legend: {
            position: "right"
        },
        tooltip: {
            format: {
                value: function(value, ratio, id) {
                    var format = d3.format(".1%");
                    return value + " Movies (" + format(ratio) + ")";
                }
            }
        }
    });
}

function drawMovieResolutionChart(resolution_data) {
    var chart = c3.generate({
        bindto: "#movie-resolution-chart",
        data: {
            json: resolution_data,
            type: "donut"
        },
        donut: {
            label: {
                format: function(value, ratio, id) {
                    return id;
                }
            },
            width: 140
        },
        legend: {
            position: "right"
        },
        tooltip: {
            format: {
                value: function(value, ratio, id) {
                    var format = d3.format(".1%");
                    return value + " Movies (" + format(ratio) + ")";
                }
            }
        }
    });
}


// show charts
function drawShowYearsChart(year_data) {
    var x_labels = ["x"];
    var y_data = ["Count"];
    for (var year in year_data) {
        x_labels.push(year);
        y_data.push(year_data[year]);
    }

    var chart = c3.generate({
        bindto: "#show-year-chart",
        data: {
            x: "x",
            type: "bar",
            columns: [
                x_labels,
                y_data,
            ],
            color: function(color, d) {
                return "#9467BD";
            }
        },
        bar: {
            width: {
                ratio: 0.6
            }
        },
        axis: {
            x: {
                type: "number",
                label: {
                    text: "Year",
                    position: "outer-center"
                },
                tick: {
                    fit: true
                }
            },
            y: {
                label: {
                    text: "Number of Shows",
                    position: "outer-middle"
                }
            }
        },
        grid: {
            x: {
                show: false
            },
            y: {
                show: true
            }
        },
        legend: {
            show: false
        }
    });
}

function drawShowGenreChart(genre_data) {
    var show_legend = true;
    if (Object.keys(genre_data).length > 52) {
        show_legend = false;
    }

    var chart = c3.generate({
        bindto: "#show-genre-chart",
        data: {
            json: genre_data,
            type: "donut"
        },
        donut: {
            label: {
                format: function(value, ratio, id) {
                    return id;
                }
            },
            width: 140
        },
        legend: {
            show: show_legend,
            position: "right"
        },
        tooltip: {
            format: {
                value: function(value, ratio, id) {
                    var format = d3.format(".1%");
                    return value + " Shows (" + format(ratio) + ")";
                }
            }
        }
    });
}

function drawShowRatingChart(rating_data) {
    var chart = c3.generate({
        bindto: "#show-rating-chart",
        data: {
            json: rating_data,
            type: "donut"
        },
        donut: {
            label: {
                format: function(value, ratio, id) {
                    return id;
                }
            },
            width: 140
        },
        legend: {
            position: "right"
        },
        tooltip: {
            format: {
                value: function(value, ratio, id) {
                    var format = d3.format(".1%");
                    return value + " Shows (" + format(ratio) + ")";
                }
            }
        }
    });
}

function drawShowDateAddedChart(date_data) {
    var x_labels = ["x"];
    var y_data = ["Total Count"];
    for (var date in date_data) {
        x_labels.push(date);
        y_data.push(date_data[date]);
    }

    var chart = c3.generate({
        bindto: "#show-date-added-chart",
        data: {
            x: "x",
            type: "area",
            columns: [
                x_labels,
                y_data,
            ],
            color: function(color, d) {
                return "#D62728";
            }
        },
        axis: {
            x: {
                type: "timeseries",
                label: {
                    text: "Date",
                    position: "outer-center"
                },
                tick: {
                    format: "%Y-%m-%d",
                    fit: false
                }
            },
            y: {
                label: {
                    text: "Total Number of Episodes",
                    position: "outer-middle"
                }
            }
        },
        grid: {
            y: {
                show: true
            }
        },
        legend: {
            show: false
        }
    });
}

function drawShowContentRatingChart(content_rating_data) {
    var chart = c3.generate({
        bindto: "#show-content-rating-chart",
        data: {
            json: content_rating_data,
            type: "donut"
        },
        donut: {
            label: {
                format: function(value, ratio, id) {
                    return id;
                }
            },
            width: 140
        },
        legend: {
            position: "right"
        },
        tooltip: {
            format: {
                value: function(value, ratio, id) {
                    var format = d3.format(".1%");
                    return value + " Shows (" + format(ratio) + ")";
                }
            }
        }
    });
}

function drawShowResolutionChart(resolution_data) {
    var chart = c3.generate({
        bindto: "#show-resolution-chart",
        data: {
            json: resolution_data,
            type: "donut"
        },
        donut: {
            label: {
                format: function(value, ratio, id) {
                    return id;
                }
            },
            width: 140
        },
        legend: {
            position: "right"
        },
        tooltip: {
            format: {
                value: function(value, ratio, id) {
                    var format = d3.format(".1%");
                    return value + " Episodes (" + format(ratio) + ")";
                }
            }
        }
    });
}

// music charts
function drawAlbumYearsChart(year_data) {
    var x_labels = ["x"];
    var y_data = ["Count"];
    for (var year in year_data) {
        x_labels.push(year);
        y_data.push(year_data[year]);
    }

    var chart = c3.generate({
        bindto: "#music-year-chart",
        data: {
            x: "x",
            type: "bar",
            columns: [
                x_labels,
                y_data,
            ],
            color: function(color, d) {
                return "#109618";
            }
        },
        bar: {
            width: {
                ratio: 0.7
            }
        },
        axis: {
            x: {
                type: "number",
                label: {
                    text: "Year",
                    position: "outer-center"
                },
                tick: {
                    fit: true
                }
            },
            y: {
                label: {
                    text: "Number of Albums",
                    position: "outer-middle"
                }
            }
        },
        grid: {
            x: {
                show: false
            },
            y: {
                show: true
            }
        },
        legend: {
            show: false
        }
    });
}

function drawAlbumGenreChart(genre_data) {
    var chart = c3.generate({
        bindto: "#album-genre-chart",
        data: {
            json: genre_data,
            type: "donut"
        },
        donut: {
            label: {
                format: function(value, ratio, id) {
                    return id;
                }
            },
            width: 140
        },
        legend: {
            show: true,
            position: "right"
        },
        tooltip: {
            format: {
                value: function(value, ratio, id) {
                    var format = d3.format(".1%");
                    return value + " Albums (" + format(ratio) + ")";
                }
            }
        }
    });
}

function drawMusicDateAddedChart(date_data) {
    var song_data = date_data["songs"];
    var album_data = date_data["albums"];

    var x_labels = ["x"];
    var y_song_data = ["Total songs"];
    var y_album_data = ["Total albums"];

    // create array of dates with no duplicates
    var dates = Object.keys(song_data).concat(Object.keys(album_data));
    var unique_dates = dates.filter(function (key, index) {return dates.indexOf(key) == index}).sort();
    x_labels = x_labels.concat(unique_dates);

    // iterate through dates and use song data and album data on that date if it exists.
    // If not, use previous date value for each series.
    var last_song_data = 0;
    var last_album_data = 0;
    for (var i = 0; i < unique_dates.length; i++) {
        var date = unique_dates[i];
        var song_date_data = song_data[date] || last_song_data;
        var album_date_data = album_data[date] || last_album_data;
        y_song_data.push(song_date_data);
        y_album_data.push(album_date_data);

        last_song_data = song_date_data;
        last_album_data = album_date_data;
    }

    var chart = c3.generate({
        bindto: "#music-date-added-chart",
        data: {
            x: "x",
            type: "area",
            columns: [
                x_labels,
                y_song_data,
                y_album_data
            ],
            color: function(color, d) {
                if (d === "Total songs" || d["id"] === "Total songs") {
                    return "#1F77B4";
                }
                else {
                    return "#FFEE00";
                }
            }
        },
        axis: {
            x: {
                type: "timeseries",
                label: {
                    text: "Date",
                    position: "outer-center"
                },
                tick: {
                    format: "%Y-%m-%d",
                    fit: false
                }
            },
            y: {
                label: {
                    text: "Number of Songs/Albums",
                    position: "outer-middle"
                }
            }
        },
        grid: {
            y: {
                show: true
            }
        },
        legend: {
            show: false
        }
    });
}

function drawMusicBitrateChart(bitrate_data) {
    var x_labels = ["x"];
    var y_data = ["Count"];

    for (var bitrate in bitrate_data) {
        x_labels.push(bitrate);
        y_data.push(bitrate_data[bitrate]);
    }

    var chart = c3.generate({
        bindto: "#music-bitrate-chart",
        data: {
            x: "x",
            type: "spline",
            columns: [
                x_labels,
                y_data
            ],
            color: function(color, d) {
                return "#E377C2";
            }
        },
        axis: {
            x: {
                type: "number",
                label: {
                    text: "Bitrate (kbps)",
                    position: "outer-center"
                },
                tick: {
                    fit: false
                }
            },
            y: {
                label: {
                    text: "Number of Songs",
                    position: "outer-middle"
                }
            }
        },
        grid: {
            y: {
                show: true
            }
        },
        legend: {
            show: false
        }
    });
}