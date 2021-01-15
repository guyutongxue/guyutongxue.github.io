/**
 * 
 * @param {string} str 
 */
function parseTeacher(str) {
    const dash = str.indexOf('-');
    const dollar = str.indexOf('$');
    return str.substring(dash + 1, dollar);
}

function get() {
    $('#tableContainer').children().remove();
    $.getJSON("https://pkuhelper.pku.edu.cn/api_xmcp/isop/scores?user_token=" + $('#userToken').val()).done(json => {
        const scores = json.cjxx;
        for (const i of scores) {
            const xq = i.xndpx + '-' + i.xq;
            if ($('#scoreTable-' + xq).length != 1)
                $('#tableContainer').append(`
                <h3>${i.xndpx} 学年度第 ${i.xq} 学期</h3>
                <table class='table'>
                    <thead>
                        <tr>
                            <th>课程名称</th>
                            <th>成绩</th>
                            <th>绩点</th>
                        </tr>
                    </thead>
                <tbody id='scoreTable-${xq}'></tbody>
                </table>`);
            const tr = $('#scoreTable-' + xq).append('<tr>');
            tr.append(`<td id='nameData'>
                <span class="badge badge-pill badge-info">${i.xf} 学分</span>
                <a target='_blank' href='https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/courseDetail/getCourseDetail.do?kclx=BK&course_seq_no=${i.zxjhbh}'>
                    ${i.kcmc}
                </a>
                <span class='text-black-50'>（${parseTeacher(i.skjsxm)}）</span>
            </td>`);
            tr.append(`<td id='scoreData'>${i.xqcj}</td>`);
            tr.append(`<td id='gpData'>${i.jd}</td>`);
        }
        const info = json.jbxx;
        $('#student').text(`${info.xm}（${info.xh}，${info.xsmc}/${info.zymc}）`);
        $('#gpa').text(`GPA: ${json.gpa.gpa}`);
    }).fail(() => {
        alert('获取失败');
    });
}