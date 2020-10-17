/*扭蛋模拟器JS 毫无可读性的代码*/
const char1 = [
    [0, 'up精选名字', 'headpicsrc'],
    //[1,'佩可莉姆','https://patchwiki.biligame.com/images/pcr/6/67/rpznjh1epytf8mbp0t1dq91svg9dcti.png'],
    //[2,'凯露','https://patchwiki.biligame.com/images/pcr/3/39/lgcqculc5zh699k6f391kiwnwcn94me.png'],
    //[3,'可可萝','https://patchwiki.biligame.com/images/pcr/a/a4/mrwruc57npoamhw5y9ttd76s0l76xzd.png'],
    [4, '由加莉', 'https://patchwiki.biligame.com/images/pcr/c/cd/mpjpf8q3fczqdn5stzx5epe7a1whb1n.png'],
    [5, '莉玛', 'https://patchwiki.biligame.com/images/pcr/0/04/lo60ot9xodirhcikbgsp5ys5j1semxf.png'],
    [6, '美咲', 'https://patchwiki.biligame.com/images/pcr/6/69/1295ipvt0ha6zly43nr690rj7qsl4py.png'],
    [7, '碧', 'https://patchwiki.biligame.com/images/pcr/2/28/dwctebo5xojfp84t1dl8rzwf5semv7n.png'],
    [8, '铃莓', 'https://patchwiki.biligame.com/images/pcr/c/cc/gwnmpp3h76m69ewd0oqnl22gtmt6hje.png'],
    [9, '依里', 'https://patchwiki.biligame.com/images/pcr/6/62/h81lrn1gzun78rl6l0354xauni9yqs0.png'],
    [10, '胡桃', 'https://patchwiki.biligame.com/images/pcr/0/0f/nwn0d9rx7uo8zxbhxcrrx1s3v4ugkfc.png'],
    [11, '未奏希', 'https://patchwiki.biligame.com/images/pcr/1/1d/biyc1gryppcb7c5tzdvqti6bmcyd55w.png'],
    [12, '怜', 'https://patchwiki.biligame.com/images/pcr/3/33/gcfzk5nghr9krp81u4x59jsbpph41qr.png'],
    //[13,'优衣','https://patchwiki.biligame.com/images/pcr/1/18/h8ni7jp1oej5mk2al7v1rjofkd4nqis.png'],
    [14, '日和莉', 'https://patchwiki.biligame.com/images/pcr/3/37/264hu9xzlhbahpe8tzexwysq3g13x3n.png'],

];
const char2 = [
    [0, 'up精选名字', 'headpicsrc'],
    [1, '茜里', 'https://patchwiki.biligame.com/images/pcr/1/14/8pn703o0duodmiyou1c565wjczj5b5o.png'],
    [2, '宫子', 'https://patchwiki.biligame.com/images/pcr/6/62/nu4e4h9eopdciqg2va9hf4c8fqjzq3q.png'],
    [3, '雪', 'https://patchwiki.biligame.com/images/pcr/c/c3/f8eexvpqyqkccbjad1uucs9z9whwnuy.png'],
    [4, '铃奈', 'https://patchwiki.biligame.com/images/pcr/e/e5/6d00c5yutzbikc8vnta72rjzppu5wvj.png'],
    [5, '香织', 'https://patchwiki.biligame.com/images/pcr/5/59/516euuhwnsfoqvolt8usv5z1jq0kfov.png'],
    [6, '美美', 'https://patchwiki.biligame.com/images/pcr/4/41/fwg0kohgsjgf76yxk3t7uleary1rho4.png'],
    [7, '惠理子', 'https://patchwiki.biligame.com/images/pcr/4/49/md183zh8ewq7lupcmo9smuymjw749cm.png'],
    [8, '忍', 'https://patchwiki.biligame.com/images/pcr/e/e1/bh7jkgsmitpvxulkc6mc217pzge6jzx.png'],
    [9, '真阳', 'https://patchwiki.biligame.com/images/pcr/2/2e/o6c9lsjthg36mzdt7cysolok3cv3pvm.png'],
    [10, '栞', 'https://patchwiki.biligame.com/images/pcr/0/05/exnyc4y1iuhrbjg3gxe7fncrj2mevmh.png'],
    [11, '千歌', 'https://patchwiki.biligame.com/images/pcr/d/db/egxfjidgjrjc8uatgi30dhvwzb3hkwn.png'],
    [12, '空花', 'https://patchwiki.biligame.com/images/pcr/b/b5/672mvpqoxo64iv5t5dkr6vs31ko148k.png'],
    [13, '珠希', 'https://patchwiki.biligame.com/images/pcr/3/39/dvomjvmcbbyliifd5hvb97mmqwtocjf.png'],
    [14, '美冬', 'https://patchwiki.biligame.com/images/pcr/c/ce/fbvjbat2po9fy580a3jyj0z2q4tmf2l.png'],
    [15, '深月', 'https://patchwiki.biligame.com/images/pcr/e/ed/mez3hg9iq9s5h6gor8ih6om9n9ln2za.png'],
    [16, '铃', 'https://patchwiki.biligame.com/images/pcr/0/02/al8yiod9vehdtaov9pgs41uovntnkr2.png'],

];
const char3 = [
    [1, '杏奈', 'https://patchwiki.biligame.com/images/pcr/7/72/edy145bksvw972yhfpfgp8qbquhsi1j.png'],
    [2, '真步', 'https://patchwiki.biligame.com/images/pcr/7/72/jb3637kcjwh7z9559n3ca377tkldr0t.png'],
    [3, '咲璃乃', 'https://patchwiki.biligame.com/images/pcr/a/a5/jsara36yjh1e8kj1srxtkztghdhmljd.png'],
    [4, '初音', 'https://patchwiki.biligame.com/images/pcr/b/ba/e1q3ot9mhbtqh7nsgpnc5bp39idld6s.png'],
    [5, '伊绪', 'https://patchwiki.biligame.com/images/pcr/8/82/a1pquxl61ls6ahhinzptb63tvadus03.png'],
    [6, '咲恋', 'https://patchwiki.biligame.com/images/pcr/8/8c/dy0rtln3fvhxkkqfxsnbnws61k8qqjh.png'],
    [7, '望', 'https://patchwiki.biligame.com/images/pcr/e/e3/ccy9fdczpyc94sfm20q7uucw6g0vm5j.png'],
    [8, '妮侬', 'https://patchwiki.biligame.com/images/pcr/9/91/4h2e4w8p876oxtcu1xv2e9anb16od6s.png'],
    [9, '秋乃', 'https://patchwiki.biligame.com/images/pcr/a/a9/hj9uxkawbpguzfrpkrr6ymjwff6vmym.png'],
    [10, '真琴', 'https://patchwiki.biligame.com/images/pcr/2/27/ergoy0815kqjqqpqn3sa0yuz2be4pco.png'],
    [11, '纯', 'https://patchwiki.biligame.com/images/pcr/9/98/4qostpj00cvuozwjjl2po690k9iu994.png'],
    [12, '静流', 'https://patchwiki.biligame.com/images/pcr/0/00/0koylmjvym7s63y8xmz9skaa1xfuo0t.png'],
    [13, '莫妮卡', 'https://patchwiki.biligame.com/images/pcr/0/03/smxy5tsyd5t92fqk5onwy56hlvbobb1.png'],
    [14, '姬塔', 'https://patchwiki.biligame.com/images/pcr/7/7f/j62dyqwinraqa1jhcey51t2xgpl3kkq.png'],
    [15, '亚里莎', 'https://patchwiki.biligame.com/images/pcr/7/7c/9mlr4cmt1yol6qam0k5eetgqpoy9wao.png'],
    [16, '伊莉亚', 'https://patchwiki.biligame.com/images/pcr/e/e2/10hawbdrcs5cv32ynab7ofxw2bfutrg.png'],
    [17, '镜华', 'https://patchwiki.biligame.com/images/pcr/1/11/kf7jk1e35kfnqqvdd9l0y5f408ktm40.png'],
    [18, '智', 'https://patchwiki.biligame.com/images/pcr/d/dd/rwvxsrizn5d3ta9gxnv7t0v7cza7y56.png'],
    [1000, '佩可莉姆（夏日）', 'https://patchwiki.biligame.com/images/pcr/8/83/mb18kfcfo4ozorh0j8bplmve049poyd.png'],
    [1001, '铃莓（夏日）', 'https://patchwiki.biligame.com/images/pcr/2/23/f2dljlbsid6btv912hunyohnebqe3n1.png'],
    [1002, '凯露（夏日）', 'https://patchwiki.biligame.com/images/pcr/8/8f/42rzcdui2rtnpf4je2h94wyz45k5kue.png'],
    [1003, '珠希（夏日）', 'https://patchwiki.biligame.com/images/pcr/7/7c/3g315v3otrc7tgxhl7snky4qdl7iaqm.png'],
    [1004, '忍（万圣节）', 'https://patchwiki.biligame.com/images/pcr/8/80/hwmi41hx1nqfpn2yru2v3g4xi3xo377.png'],

];


//获取随机数（默认10000内）
function getRand(a = 10000) {
    let tmp = Math.ceil(Math.random() * a);
    return tmp;
}

var char3bak = (function (source) {
    return JSON.parse(JSON.stringify(source));
})(char3);


//选中角色清单 (是否为限定角色 ，表池id)
var charSel = [];
//中奖几率 3x 2x
let chance = [250, 8200];
function cgchance(a) {
    if (a == 2) {
        chance = [500, 8200];
    } else {
        chance = [250, 8200];
    }
}
//扭蛋

let result = [[0, 0]];

//从角色列表中获取一个角色
function pickchar(a, b) {
    var rand = 0;
    switch (a) {
        case 1: {
            rand = getRand(char1.length - 1);
            return rand;
        }
        case 2: {
            rand = getRand(char2.length - 1);
            return rand;
        }
        case 3: {
            if (getRand() < 2800 && charSel.length > 0) {
                let tmp = getRand(charSel.length - 1);
                return charSel[tmp];
            } else {
                let tmp = getRand(char3bak.length - 1);
                do {
                    tmp = getRand(char3bak.length - 1);
                } while (char3bak[tmp][0] > 1000)
                return tmp;
            }
        }
        default: {
            console.log("模块：公主连结扭蛋模拟器:获取指定角色出错");
        }
    }

}


//获取角色实际点位
function getlocale(loc) {
    for (let i = 0; i < char3.length; i++) {
        if (char3[i][0] == loc) {
            return i;
        }
    }
}

//深度克隆


var vm = new Vue({
    el: '#content',
    data: {
        allChar: [null, char1, char2, char3],
        times: 0,
        secStone: 0,
        result: [],
        x3Num: 0
    },
    computed: {
        gem: function () {
            return this.times * 150;
        },
        ratio: function () {
            return (this.x3Num / this.times * 100).toFixed(3);
        },
        money: function () {
            return (this.times * (15.54)).toFixed(2);
        }
    },
    methods: {
        /**
         * 
         * @param {*} no1x 
         * @return {boolean} Has 2x/3x gotten
         */
        gacha: function (no1x = false) {
            let rand = getRand();
            if (!no1x) {
                if (rand <= chance[0]) { // pick 3x
                    this.secStone += 50;
                    this.result.push([3, pickchar(3, rand)]);
                    this.x3Num++;
                    return true;
                } else if (rand > chance[0] && rand <= chance[1]) { // pick 1x
                    this.secStone += 1;
                    this.result.push([1, pickchar(1, rand)]);
                    return false;
                } else { // pick 2x
                    this.secStone += 10;
                    this.result.push([2, pickchar(2, rand)]);
                    return true;
                }
            } else { // 触发保底
                if (rand <= chance[0]) { // pick 3x
                    this.secStone += 50;
                    this.result.push([3, pickchar(3, rand)]);
                    this.x3Num++;
                } else { // pick 2x
                    this.secStone += 10;
                    this.result.push([2, pickchar(2, rand)]);
                }
            }
        },
        getOne: function () {
            this.result = [];
            this.gacha();
            this.times++;
        },
        getTen: function () {
            this.result = [];
            let has2x = false;
            this.times += 10;
            for (i = 1; i <= 9; i++) {
                has2x = this.gacha();
            }
            this.gacha(!has2x);
        },
        reset: function () {
            this.times = 0;
            this.secStone = 0;
            this.result = [];
            this.x3Num = 0;
        }
    }
})