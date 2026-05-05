export type BuildingOfficialSource = {
  label: string;
  type: "官网" | "政府平台" | "开放信息";
  url: string;
  note: string;
};

export const buildingOfficialSourcesV2: Record<string, BuildingOfficialSource[]> = {
  "forbidden-city": [
    {
      label: "故宫博物院",
      type: "官网",
      url: "https://www.dpm.org.cn/",
      note: "可用于查看导览、开放时间、票务与展览信息。",
    },
  ],
  weiyang: [
    {
      label: "西安市国家重点文物保护单位名录",
      type: "政府平台",
      url: "https://www.xa.gov.cn/gk/wtly/ssml/5fbb551ff8fd1c59664b3711.html",
      note: "可作为汉长安城未央宫遗址的官方文保名录来源。",
    },
    {
      label: "西安市“十四五”文化和旅游发展规划",
      type: "政府平台",
      url: "https://www.xa.gov.cn/gk/zcfg/szfbgtwj/619468c5f8fd1c0bdc69cced.html",
      note: "包含未央宫遗址保护展示与环境提升相关表述。",
    },
  ],
  daming: [
    {
      label: "大明宫遗址保护区",
      type: "政府平台",
      url: "https://qjxq.xa.gov.cn/zjqj/qyts/5df21c4065cbd81235fc1c82.html",
      note: "可作为大明宫国家遗址公园开放、保护与展示的官方参考。",
    },
    {
      label: "西安市A级旅游景区信息表",
      type: "政府平台",
      url: "https://www.xa.gov.cn/ztzl/ztzl/lzledc/ywdc/1824366329290301442.html",
      note: "可补充大明宫国家遗址公园等级、地址等官方旅游信息。",
    },
  ],
  zhaozhou: [
    {
      label: "河北文旅·赵州桥景区",
      type: "政府平台",
      url: "https://whly.hebei.gov.cn/c/2023-11-08/574425.html",
      note: "可作为景区开放、客流与文旅活动的官方参考来源。",
    },
    {
      label: "赵县概况",
      type: "政府平台",
      url: "https://www.zhaoxian.gov.cn/columns/41863622-df41-4005-bdea-34c8d5895d95/index.html",
      note: "用于补充赵州桥在地方文物与历史中的官方表述。",
    },
  ],
  lugou: [
    {
      label: "首都之窗·卢沟桥",
      type: "政府平台",
      url: "https://www.beijing.gov.cn/renwen/rwzyd/qgzdwwbhdw/lgq/202211/t20221101_2849491.html",
      note: "含开放时间、票务、联系电话与景区位置。",
    },
    {
      label: "卢沟桥历史博物馆",
      type: "政府平台",
      url: "https://www.beijing.gov.cn/renwen/rwzyd/bwg/lgqlsbwg/202301/t20230113_2899067.html",
      note: "适合补充桥梁技法、历史与展陈信息。",
    },
  ],
  huizhou: [
    {
      label: "黄山市人民政府·徽州古城",
      type: "政府平台",
      url: "https://www.huangshan.gov.cn/site/tpl/4636?id=19774&type=scenic",
      note: "含开放时间、景区电话和承载量等信息。",
    },
  ],
  suzhou: [
    {
      label: "苏州市园林局·开放时间",
      type: "政府平台",
      url: "https://ylj.suzhou.gov.cn/szsylj/kfsj/wztt.shtml",
      note: "可用于查询拙政园、留园、狮子林等苏州园林官方开放时间。",
    },
    {
      label: "苏州市人民政府·园林夜游",
      type: "政府平台",
      url: "https://www.suzhou.gov.cn/szsrmzf/dstx/202508/663ef8f2e501452287e2ae638a3ed576.shtml",
      note: "可补充节假日或夜游开放等最新官方动态。",
    },
  ],
  tulou: [
    {
      label: "福建省人民政府·福建土楼",
      type: "政府平台",
      url: "https://www.fujian.gov.cn/zwgk/ztzl/sxzygwzxsgzx/sdjj/wvjj/202506/t20250605_6921757.htm",
      note: "可作为福建土楼整体保护、活化利用和文旅背景的官方来源。",
    },
    {
      label: "福建省人民政府·福建土楼（永定）景区活动",
      type: "政府平台",
      url: "https://www.fujian.gov.cn/xwdt/tpxx/202510/t20251001_7018174.htm",
      note: "适合补充节假日演艺活动和景区动态。",
    },
  ],
};

buildingOfficialSourcesV2["zhaozhou-bridge"] = buildingOfficialSourcesV2.zhaozhou;
buildingOfficialSourcesV2["lugou-bridge"] = buildingOfficialSourcesV2.lugou;
buildingOfficialSourcesV2["huizhou-residence"] = buildingOfficialSourcesV2.huizhou;
buildingOfficialSourcesV2["fujian-tulou"] = buildingOfficialSourcesV2.tulou;
