var num = 12;

/**
 * 
 * @param {number} n 
 */
function getBinary(n) {
    return ('00000000' + n.toString(2)).slice(-8);
}

/**
 * 
 * @param {string} n 
 */
function getDecimal(n) {
    return parseInt(n, 2)
}

/**
 * 
 * @param {string} n 
 */
function setBitset(n) {
    let str = getBinary(n);
    for (let i = 0; i < str.length; i++) {
        $("#bitset td").eq(i).text(str[i]);
    }
}

/**
 * 
 * @param {number} n 
 */
function setFormula(n) {
    let str = getBinary(n);
    let result = "";
    let resultNum = NaN;

    let sign = str[0];
    let signNum = 1;
    if (sign === '0') {
        result += "\\textcolor{#0070c0}{+}";
        signNum = 1;
    } else {
        result += "-";
        signNum = -1;
    }
    let frac = str.slice(5, 8);
    let fracNum = 0;
    let exp = str.slice(1, 5);
    let expNum = 0;
    function getFracNum(str) {
        let len = str.length - 1;
        let num = parseInt(str.replace('.', ''), 2);
        return num / Math.pow(2, len - 1);
    }
    if (exp === "1111") {
        if (frac.includes('1')) {
            result = "\\tt NaN";
            resultNum = NaN;
        } else {
            result += "\\infty";
            resultNum = Infinity;
        }
        $("#category").text("特殊值　");
        $("#result").text("");
    } else {
        if (exp === "0000") {
            frac = "0." + frac;
            expNum = getDecimal(exp) - 6;
            $("#category").text("非规格化值：");
        } else {
            frac = "1." + frac;
            expNum = getDecimal(exp) - 7;
            $("#category").text("规格化值：");
        }
        fracNum = getFracNum(frac);
        resultNum = signNum * fracNum * Math.pow(2, expNum);
        result += (`\\textcolor{#00b050}{${frac}} \\times 10 ^ \\textcolor{red}{${expNum.toString(2)}}`);
        katex.render(resultNum.toString(), $("#result")[0], {
            throwOnError: false
        });
    }
    katex.render(result, $("#formula")[0], {
        throwOnError: false,
        displayMode: true
    });
    return resultNum;
}

function drawAxis(n) {
    $("#figure").html("");
    var svg = d3.select("#figure")
        .append("svg")
        .attr("width", 850)
        .attr("height", 200)

    var x1 = d3.scaleLinear()
        .domain([-10, 10])
        .range([25, 825]);
    var x2 = d3.scaleLinear()
        .domain([-1, 1])
        .range([25, 825]);
    var x3 = d3.scaleLinear()
        .domain([-0.1, 0.1])
        .range([25, 825]);

    svg
        .append("g")
        .attr("transform", "translate(0,50)")
        .call(d3.axisBottom(x1));
    svg
        .append("g")
        .attr("transform", "translate(0,100)")
        .call(d3.axisBottom(x2));

    svg
        .append("g")
        .attr("transform", "translate(0,150)")
        .call(d3.axisBottom(x3));

    if (!isFinite(n)) return;
    
    svg
        .append("circle")
        .attr("cx", x1(n))
        .attr("cy", 0)
        .attr("transform", "translate(0,50)")
        .attr("r", 3)
        .attr("fill", "red");
    svg
        .append("circle")
        .attr("cx", x2(n))
        .attr("cy", 0)
        .attr("transform", "translate(0,100)")
        .attr("r", 3)
        .attr("fill", "red");
    svg
        .append("circle")
        .attr("cx", x3(n))
        .attr("cy", 0)
        .attr("transform", "translate(0,150)")
        .attr("r", 3)
        .attr("fill", "red");
}

/**
 * 
 * @param {number} n 
 */
function setAll(n) {
    setBitset(n);
    let result = setFormula(n);
    drawAxis(result);
}

var current = 0;

$(document).ready(() => {
    setAll(current);
    $("#container").on("mousewheel", (e) => {
        let delta = e.originalEvent.wheelDelta;
        if (delta < 0) {
            current++;
            if (current === 256)
                current = 0;
        } else if (delta > 0) {
            current--;
            if (current === -1)
                current = 255;
        }
        setAll(current);
    })
})