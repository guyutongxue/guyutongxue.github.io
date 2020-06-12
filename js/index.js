(function () {
    var target = document.getElementById("projects");
    $.getJSON("/json/projects.json", function (json) {
        console.log(json);
        for (var i in json) {
            var htmlText = "\
<div class='col-md-3'>\
    <div class='card project-card'>\
        <div class='card-img-top project-card-img-container'>\
            <img class='project-card-img' src='"+ json[i].img + "' alt='" + json[i].name + "'>\
        </div>\
        <div class='card-body'>\
            <h4 class='card-title'>"+ json[i].name + "</h4>\
            <p class='card-text'>"+ json[i].discription + "</p>\
            <div class='d-flex justify-content-between align-items-center'>\
                <a class='btn btn-sm btn-dark' target='_blank' href='"+ json[i].link + "'>查看</a>\
                <small>"+ json[i].update + "</small>\
            </div>\
        </div>\
    </div>\
</div>";
            target.innerHTML += htmlText;
        }
    });
})();