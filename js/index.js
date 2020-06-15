// charset: UTF-8 注意编码格式防止乱码
(function () {
    var target = document.getElementById("projects");
    $.getJSON("json/projects.json", function (json) {
        console.log(json);
        for (var i in json) {
            var update_time = undefined;
            if (typeof([i].update) != "undefined") {
                update_time = new Date(json[i].update);
            } else {
                $.ajax({
                    type: "GET",
                    url: "https://api.github.com/repos/" + json[i].github,
                    async: false,
                    timeout: 1000,
                    success: function(body) {
                        update_time = new Date(body.updated_at);
                        console.log(update_time);
                    }
                })
            }
            var htmlText = "\
<div class='col-lg-3 col-md-4 mb-3'>\
    <div class='card project-card'>\
        <div class='card-img-top project-card-img-container'>\
            <img class='project-card-img' src='"+ json[i].img + "' alt='" + json[i].name + "'>\
        </div>\
        <div class='card-body'>\
            <h4 class='card-title'>"+ json[i].name + "</h4>\
            <p class='card-text'>"+ json[i].discription + "</p>\
            <div class='d-flex justify-content-between align-items-center'>\
                <a class='btn btn-sm btn-dark' target='_blank' href='"+ json[i].link + "'>查看</a>\
                <small>"+ update_time.toLocaleDateString() + "</small>\
            </div>\
        </div>\
    </div>\
</div>";
            target.innerHTML += htmlText;
        }
    });
})();