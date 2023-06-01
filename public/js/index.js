// charset: UTF-8 注意编码格式防止乱码

function changeLang(text) {
    $('div[data-lang]').hide();
    $('a.project-tab').removeClass('active');
    $('div[data-lang='+ text +']').show();
    $('#langId' + text).addClass('active');
    if ($('#projects div:visible').length > 0) {
        $('#noneIndicator').hide();
    } else {
        $('#noneIndicator').show();
    }
}

(function () {
    let tabs = document.querySelector('#projectTabs');
    $.getJSON("/json/language.json", function(json){
        for (let i in json) {
            let htmlText = '\
<a class="project-tab btn btn-light ml-2 mr-2 mb-2" id="langId'+ json[i].id +'" href="javascript:changeLang(\''+ json[i].id +'\');void(0)">\
    <img width="30" src="https://dderevjanik.github.io/vscode-icons-js-example/icons/' + json[i].icon + '.svg" alt = "' + json[i].text + '" title="' + json[i].text + '">\
</a>';
            tabs.innerHTML += htmlText;
        }
    });
    let projects = document.querySelector("#projects");
    $.getJSON("/json/projects.json", function (json) {
        console.log(json);
        for (let i in json) {
            let htmlText = "\
<div class='col-lg-3 col-md-4 mb-3' data-lang='" + json[i].lang + "'>\
    <div class='card project-card'>\
        <div class='card-img-top project-card-img-container'>\
            <img class='project-card-img' src='"+ json[i].img + "' alt='" + json[i].name + "'>\
        </div>\
        <div class='card-body'>\
            <h4 class='card-title'>"+ json[i].name + "</h4>\
            <p class='card-text'>"+ json[i].discription + "</p>\
            <div class='d-flex justify-content-between align-items-center'>\
                " + (typeof(json[i].link) != "undefined" ? "\
                <a class='btn btn-sm btn-dark' target='_blank' href='"+ json[i].link + "'>查看</a>\
                " : "") + "\
                <small class='update-time'> </small>\
            </div>\
        </div>\
    </div>\
</div>";
            projects.innerHTML += htmlText;
        }
        changeLang('cpp');
        for (var i in json) {
            var update_time = undefined;
            if (typeof([i].update) != "undefined") {
                update_time = new Date(json[i].update);
                $('#updateTime').html(update_time.toLocaleDateString());
            } else {
                $.ajax({
                    type: "GET",
                    index: i, // self-defined
                    url: "https://api.github.com/repos/" + json[i].github,
                    async: true,
                    timeout: 1000,
                    success: function(body) {
                        update_time = new Date(body.pushed_at);
                        console.log(update_time.toLocaleDateString());
                        $('.update-time').eq(this.index).text(update_time.toLocaleDateString());
                    },
                    error: function() {
                        console.warn('Failed to get info');
                    }
                })
            }
        }
    });
})();
