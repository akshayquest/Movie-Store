$(document).ready(function () {
    $.getJSON("http://starlord.hackerearth.com/movieslisting", function (movies) {
        $.each(movies, function (index, movie) {
            movieArray.push(movie);
        });
    });
});

var movieArray = [];
var selectedMovieArray = [];
var selectedMovie = "";
function getMovies() {
    var outputHTML = '';
    selectedMovieArray = [];
    var searchText = $('#searchText').val();
    if (searchText == "") {
        $('#movies').html("");
        return;
    }
    var count = 1;

    outputHTML += '<div class="table-responsive">'
    outputHTML += '<table class="table" id = "movieTable">'
    outputHTML += '<thead>'
    outputHTML += '<tr>'
    outputHTML += '<th>#</th>'
    outputHTML += '<th>Name</th>'
    outputHTML += '<th onclick = "sortTable(2)" style = "cursor: pointer;">Release year</th>'
    outputHTML += '<th>Language <input type="text" id="langIP" onkeyup="filterTable(3)" placeholder="Filter.." style = "width: 80px !important; height: 30px !important;"/></th>'
    outputHTML += '<th>Country <input type="text" id="countryIP" onkeyup="filterTable(4)" placeholder="Filter.." style = "width: 80px !important; height: 30px !important;"/></th>'
    outputHTML += '<th>Details</th>'
    outputHTML += '</tr>'
    outputHTML += '</thead>'
    $.each(movieArray, function (index, movie) {
        if ((movie.movie_title.toLowerCase().trim().indexOf(searchText.toLowerCase().trim())) != -1) {
            outputHTML += '<tbody>'
            outputHTML += '<tr>'
            outputHTML += '<td>'+ count++ + '</td>'
            outputHTML += '<td>' + movie.movie_title + '</td>'
            outputHTML += '<td>' + movie.title_year + '</td>'
            outputHTML += '<td>' + movie.language + '</td>'
            outputHTML += '<td>' + movie.country + '</td>'
            outputHTML += '<td><a onclick="getMovie(\'' + movie.movie_imdb_link + '\')" href="#">More Details</a></td>'
            outputHTML += '</tr>'
            outputHTML += '</tbody>'
            selectedMovieArray.push(movie);
        }
    });
    outputHTML += '</table>'
    outputHTML += '</div>'
    if (selectedMovieArray.length > 0) {
        $('#movies').html(outputHTML);
    }
    else {
        $('#movies').html("");
    }
    
}

function getMovie(selectedMovie) {
    $("#movieList").hide();
    $("#movieDetails").show();
    $.each(selectedMovieArray, function (index, movie) {
        if (movie.movie_imdb_link == selectedMovie) {
            var outputHTML = '';
            outputHTML += '<div class="row">'
            outputHTML += '<div class="col-md-8">'
            outputHTML += '<h2>' + movie.movie_title + '</h2>'
            outputHTML += '<ul class="list-group">'
            outputHTML += '<li class="list-group-item"><strong>Director:</strong> ' + movie.director_name + '</li>'
            outputHTML += '<li class="list-group-item"><strong>Starring:</strong> ' + movie.actor_1_name + ' and ' + movie.actor_2_name + '</li>'
            outputHTML += '<li class="list-group-item"><strong>Genre:</strong> ' + movie.genres + '</li>'
            outputHTML += '<li class="list-group-item"><strong>Language:</strong> ' + movie.language + '</li>'
            outputHTML += '<li class="list-group-item"><strong>Country:</strong> ' + movie.country + '</li>'
            outputHTML += '<li class="list-group-item"><strong>Rating:</strong> ' + movie.content_rating + '</li>'
            outputHTML += '<li class="list-group-item"><strong>Budget:</strong> ' + movie.budget + '</li>'
            outputHTML += '<li class="list-group-item"><strong>Release Year:</strong> ' + movie.title_year + '</li>'
            outputHTML += '<li class="list-group-item"><strong>Plot:</strong> ' + movie.plot_keywords + '</li>'
            outputHTML += '</ul>'
            outputHTML += '</div>'
            outputHTML += '</div>'
            outputHTML += '<div class="row">'
            outputHTML += '<div class="well">'
            outputHTML += '<br />'
            outputHTML += '<a href="' + movie.movie_imdb_link + '" target="_blank" class="btn btn-primary">View IMDB</a>'
            outputHTML += '<a href="index.html" class="btn btn-default">Go Back To Search</a>'
            outputHTML += '</div>'
            outputHTML += '</div>'
            $('#movie').html(outputHTML);
            return;
        }
    });
}


function autocomplete(inp) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        getMovies();
    });
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
}
autocomplete(document.getElementById("searchText"));

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("movieTable");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1) ; i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function filterTable(n) {
    var input, filter, table, tr, td, i;
    if (n == 3) {
        input = document.getElementById("langIP");
        filter = input.value.toLowerCase();
    }
    else if (n == 4){
        input = document.getElementById("countryIP");
        filter = input.value.toLowerCase();
    }
    
    table = document.getElementById("movieTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[n];
        if (td) {
            if (td.innerHTML.toLowerCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
