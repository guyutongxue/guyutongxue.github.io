/** @param url {string} */
function newWin(url) {
    window.open(url);
}


const graphContainer = document.getElementById("graph-container");
const gitgraph = GitgraphJS.createGitgraph(graphContainer, {
    template: GitgraphJS.templateExtend('metro', {
        commit: {
            message: {
                displayAuthor: false,
                displayHash: false,
                font: "normal 12pt Consolas,mono-space"
            },
            dot: {
                size: 8
            }
        },
        branch: {
            lineWidth: 5,
            spacingY: 20,
        },
        colors: [
            "#a4343a",
            "#004b87",
            "#008c95",
            "#aa0061",
            "#b58500",
            "#009b77",
            "#0092bc",
            "#ca9a8e"
        ]
    }),
    orientation: "vertical-reverse",
});

// Simulate git commands with Gitgraph API.
const bloodshed = gitgraph.branch("bloodshed");
bloodshed.commit({
    tag: "v1.0",
    subject: "release in 1998"
})
bloodshed.commit({
    tag: "old versions...",
    subject: "　"
});
bloodshed.commit({
    tag: "v4.0",
    subject: "released in 2001"
});
bloodshed.commit({
    tag: "v4.9.1.0",
    subject: "released at 2002-03-19"
});
bloodshed.commit({
    tag: "v4.9.2.0",
    subject: "released at 2002-04-13"
});
bloodshed.commit({
    tag: "v4.9.3.0",
    subject: "released at 2002-05-14"
});
bloodshed.commit({
    tag: "v4.9.4.0",
    subject: "released at 2002-06-26"
});
bloodshed.commit({
    tag: "v4.9.5.0",
    subject: "released at 2002-08-01"
});
bloodshed.commit({
    tag: "v4.9.6.0",
    subject: "released at 2002-09-28"
});
bloodshed.commit({
    tag: "v4.9.7.0",
    subject: "released at 2002-12-04"
});
bloodshed.commit({
    tag: "v4.9.8.0",
    subject: "released at 2003-03-25"
});
bloodshed.commit({
    tag: "v4.9.9.0",
    subject: "released at 2004-07-31"
});
bloodshed.commit({
    tag: "v4.9.9.2",
    subject: "released at 2005-02-22 (with GCC 3.4.2)"
})
const orwell = gitgraph.branch("Orwell Dev-C++");
const wx = gitgraph.branch("wxDev-C++");
wx.commit({
    tag: 'v6.10.2',
    subject: 'released at 2007-03-21'
});
wx.commit({
    tag: 'v7.3.1',
    subject: 'released at 2010-02-19'
});
orwell.commit({
    tag: "v5.0.0.0",
    subject: "released at 2011-10-15"
});
wx.commit({
    tag: 'v7.4',
    subject: 'released at 2011-11-16'
});
orwell.commit({
    tag: 'v5.1.0.0',
    subject: 'released at 2011-12-27'
});
orwell.commit({
    tag: 'v5.2.0.0',
    subject: 'released at 2012-04-17'
})
wx.commit({
    tag: 'v7.4.2',
    subject: 'released at 2012-06-04'
});
orwell.commit({
    tag: 'v5.3.0.0',
    subject: 'released at 2012-09-30 (with GCC 4.7.0)'
});
const smart = gitgraph.branch("Smart C++");
smart.commit({
    tag: 'v6.0.0',
    subject: 'released in 2013 (Formally Smart C++ 1.2.5)'
})
orwell.commit({
    tag: 'v5.4.0',
    subject: 'released at 2013-02-14 (with GCC 4.7.1)'
});
orwell.commit({
    tag: 'v5.5.0',
    subject: 'released at 2013-10-06 (with GCC 4.7.2)'
});
orwell.commit({
    tag: 'v5.6.0',
    subject: 'released at 2014-01-24 (with GCC 4.8.1)'
});
orwell.commit({
    tag: 'v5.7.0',
    subject: 'released at 2014-07-19 (with GCC 4.8.1)'
});
orwell.commit({
    tag: 'v5.8.0',
    subject: 'released at 2014-10-24 (with GCC 4.8.1)'
});
orwell.commit({
    tag: 'v5.9.0',
    subject: 'released at 2015-01-24 (with GCC 4.8.1)'
});
orwell.commit({
    tag: 'v5.10',
    subject: 'released at 2015-03-20 (with GCC 4.8.1)'
});
orwell.commit({
    tag: 'v5.11',
    subject: 'released at 2015-04-27 (with GCC 4.9.2)'
})
const embarcadero = gitgraph.branch("Embarcadero Dev-C++");
const redpanda = gitgraph.branch("Red Panda Dev-C++");
const banzhu = gitgraph.branch("BanshuSoft Dev-C++");
const devcpp6 = gitgraph.branch("devcpp6");
banzhu.commit({
    tag: 'v5.13',
    subject: 'released at 2020-05-04 (with GCC 9.2.0)'
});
embarcadero.merge({
    branch: bloodshed,
    commitOptions: {
        tag: 'v5.50',
        subject: 'released at 2020-07-01 (with GCC 4.9.2)'
    }
});
banzhu.commit({
    tag: 'v5.14',
    subject: 'released at 2020-07-22 (with GCC 9.2.0)'
});
banzhu.commit({
    tag: 'v5.15',
    subject: 'released at 2020-09-05 (with GCC 9.2.0)'
});
redpanda.commit({
    tag: 'v5.12',
    subject: 'released at 2020-09-09 (with GCC 9.2.0)'
});
embarcadero.commit({
    tag: 'v6.0',
    subject: 'released at 2020-10-13 (with GCC 9.2.0)'
});
embarcadero.commit({
    tag: 'v6.1',
    subject: 'released at 2020-11-02 (with GCC 9.2.0)'
});
embarcadero.commit({
    tag: 'v6.2',
    subject: 'released at 2020-11-13 (with GCC 9.2.0)'
});
redpanda.commit({
    tag: 'v6.0',
    subject: 'released at 2020-11-07 (with GCC 9.2.0)'
});
redpanda.commit({
    tag: 'v6.1',
    subject: 'released at 2020-11-22 (with GCC 9.2.0)'
});
redpanda.commit({
    tag: 'v6.2',
    subject: 'released at 2020-12-09 (with GCC 9.2.0)'
});
devcpp6.commit({
    tag: 'v6.0~build1',
    subject: 'released at 2020-12-25 (with GCC 9.2.0)'
});
redpanda.commit({
    tag: 'v6.3',
    subject: 'released at 2021-01-14 (with GCC 10.2.0)'
});
embarcadero.commit({
    tag: 'v6.3',
    subject: 'released at 2021-01-30 (with GCC 9.2.0)'
})
