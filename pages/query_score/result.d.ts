// https://isop.pku.edu.cn/svcpub/index_pro_api.html#STUDENT_SCORE

export type Result = {
    /** 请求是否成功 */
    success: true,

    /** 学生类别 */
    xslb: "bks" | "yjs",

    /** 研究生学号 */
    xh?: string,

    /** 研究生姓名 */
    xm?: string,

    /** 研究生成绩信息列表 */
    scoreLists?: {}[]

    /** 本科生基本信息 */
    jbxx?: {

        /** 学号 */
        xh: string,

        /** 系所英文名 */
        xsyw: string,

        /** 姓名 */
        xm: string,

        /** 系所名 */
        xsmc: string,

        /** 专业英文名 */
        zyywmc: string,

        /** 学籍状态 */
        xjzt: string,

        /** 姓名拼音 */
        xmpy: string,

        /** 入学年份 */
        zxnj: string,

        /** 专业名 */
        zymc: string
    },

    /** 本科生成绩信息 */
    cjxx?: {
        /** 学生类别 */
        xslb: string,

        /** 课程执行计划编号 */
        zxjhbh: string,

        /** 教学班号 */
        jxbh: string,

        /** 课程体系码 */
        kctxm: string,

        /** 学期成绩 */
        xqcj: string,

        /** 学期 */
        xq: string,

        /** 课程英文名 */
        ywmc: string,

        /** 授课教师姓名 */
        skjsxm: string,

        /** 授课教师职工号 */
        skjszgh: string,

        /** 学年度 */
        xnd: string,

        /** 绩点 */
        jd: string,

        /** 课程号 */
        kch: string,

        /** 本科成绩编号 */
        bkcjbh: string,

        /** 课程类别名称 */
        kclbmc: string,

        /** 学年度学期全称 */
        xndxqpx: string,

        /** 课程名称 */
        kcmc: string,

        /** 学年度全称 */
        xndpx: string,

        /** 学分 */
        xf: string,

        /** 课程类别 */
        kclb: string,

        /** 课程体系 */
        kctx: string
    }[],
    
    /** 本科生转交流成绩信息 */
    zjlcjxx?: object[],

    /** 本科生毕业论文成绩信息 */
    bylwcjxx?: object,

    /** 本科生辅修双学位成绩信息 */
    fscjxx?: object[],

    /** 统计数据 */
    gpaHM: {
        /** 通选课学分 */
        txkxf: string,

        /** 任选学分 */
        rxxf: string,

        /** 不及格必修课程数 */
        bxxxbjgms: string,

        /** 计入平均绩点的总学分 */
        zxfgpa: string,

        /** 平均绩点 */
        gpa: string,

        /** 不及格总学分 */
        bjgzxf: string,

        /** 总学分 */
        zxf: string,

        /** 已修课程数 */
        xkms: string,

        /** 绩点和 */
        jdsum: string,

        /** 必修学分 */
        bxxf: string,

        /** ？学分 */
        xxxf: string,

        /** 绩点 */
        jd: string,

        /** 限选学分 */
        xzxf: string,
        
        /** 不及格课程数 */
        bjgms: string,

        /** 奖励总学分 */
        jlzxf: string
    },

    /** 本科生平均绩点 */
    gpa?: {
        /** 平均绩点 */
        gpa: string
    },

    /** 本科生辅修双学位平均绩点 */
    fsgpa?: {
        /** 平均绩点 */
        fsgpa: string
    }
} | {
    /** 请求是否成功 */
    success: false,

    /** 请求失败原因 */
    errMsg: string
}