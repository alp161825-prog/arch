const userBuildingImageEntries = [
  { names: ["一颗印"], path: "/user-images/图片/一颗印.jpg" },
  { names: ["三杨庄遗址"], path: "/user-images/图片/三杨庄遗址.jpg" },
  { names: ["二里头遗址半地穴式房屋"], path: "/user-images/图片/二里头遗址半地穴式房屋.jpeg" },
  { names: ["二里头宫殿区", "二里头宫殿"], path: "/user-images/图片/二里头遗址半地穴式房屋.jpeg" },
  { names: ["元上都大安阁"], path: "/user-images/图片/元上都大安阁.jpg" },
  { names: ["北京四合院", "四合院"], path: "/user-images/图片/北京四合院.jpg" },
  { names: ["北京故宫", "故宫", "紫禁城"], path: "/user-images/图片/故宫.jpg" },
  { names: ["北宋开封府", "开封府"], path: "/user-images/图片/北宋开封府.jpg" },
  { names: ["北宋许驸马府"], path: "/user-images/图片/北宋许驸马府.jpg" },
  { names: ["华清宫"], path: "/user-images/图片/华清宫.jpg" },
  { names: ["南京故宫"], path: "/user-images/图片/南京故宫.jpg" },
  { names: ["南阳府衙"], path: "/user-images/图片/南阳府衙.jpg" },
  { names: ["卢沟桥"], path: "/user-images/图片/卢沟桥.jpg" },
  { names: ["唐大明宫", "大明宫", "大明宫含元殿"], path: "/user-images/图片/唐大明宫.jpg" },
  { names: ["姬氏民居"], path: "/user-images/图片/姬氏民居.jpg" },
  { names: ["广济桥"], path: "/user-images/图片/广济桥.jpg" },
  { names: ["德寿宫遗址", "德寿宫"], path: "/user-images/图片/德寿宫遗址.jpg" },
  { names: ["徽州明代住宅", "徽州民居"], path: "/user-images/图片/徽州明代住宅.jpg" },
  { names: ["恭王府"], path: "/user-images/图片/恭王府.jpg" },
  { names: ["承德避暑山庄"], path: "/user-images/图片/承德避暑山庄.jpg" },
  { names: ["殷墟宫殿宗庙遗址", "殷墟宫殿遗址"], path: "/user-images/图片/殷墟宫殿宗庙遗址.jpg" },
  { names: ["汉代坞壁"], path: "/user-images/图片/汉代坞壁.jpg" },
  { names: ["汉未央宫", "未央宫"], path: "/user-images/图片/汉未央宫.jpg" },
  { names: ["汴京虹桥"], path: "/user-images/图片/汴京虹桥.jpg" },
  { names: ["沈阳故宫"], path: "/user-images/图片/沈阳故宫.jpg" },
  { names: ["十七孔桥"], path: "/user-images/图片/十七孔桥.jpg" },
  { names: ["洛阳天津桥"], path: "/user-images/图片/洛阳天津桥.jpg" },
  { names: ["洛阳旅人桥"], path: "/user-images/图片/洛阳旅人桥.jpg" },
  { names: ["洛阳桥"], path: "/user-images/图片/洛阳桥.jpg" },
  { names: ["滕王阁"], path: "/user-images/图片/滕王阁.jpg" },
  { names: ["王家大院"], path: "/user-images/图片/王家大院.jpg" },
  { names: ["福建土楼"], path: "/user-images/图片/福建土楼.jpg" },
  { names: ["秦咸阳宫", "咸阳宫"], path: "/user-images/图片/秦咸阳宫.jpg" },
  { names: ["窑洞"], path: "/user-images/图片/窑洞.jpg" },
  { names: ["绥远将军衙署"], path: "/user-images/图片/绥远将军衙署.jpg" },
  { names: ["蒲津渡浮桥"], path: "/user-images/图片/蒲津渡浮桥.jpg" },
  { names: ["蓟辽督师府"], path: "/user-images/图片/蓟辽督师府.jpg" },
  { names: ["西汉七星桥"], path: "/user-images/图片/西汉七星桥.jpg" },
  { names: ["西汉长安城中央官署遗址"], path: "/user-images/图片/西汉长安城中央官署遗址.jpg" },
  { names: ["赵州桥"], path: "/user-images/图片/赵州桥.jpg" },
  { names: ["迎祥桥"], path: "/user-images/图片/迎祥桥.jpg" },
  { names: ["阿房宫", "阿房宫遗址"], path: "/user-images/图片/阿房宫.jpg" },
  { names: ["隋大兴宫"], path: "/user-images/图片/隋大兴宫.jpg" },
  { names: ["隋灞桥", "灞桥遗址"], path: "/user-images/图片/隋灞桥.jpg" },
  { names: ["霍州署大堂", "霍州署"], path: "/user-images/图片/霍州署大堂.jpg" },
  { names: ["颐和园"], path: "/user-images/图片/颐和园.jpg" },
  { names: ["黄河铁桥"], path: "/user-images/图片/黄河铁桥.jpg" },
];

const normalize = (value: string) =>
  value.replace(/[遗址宗庙区宫殿含元殿阁（）；、\s\-—()]/g, "").trim();

const userBuildingImageMap = new Map<string, string>();

for (const entry of userBuildingImageEntries) {
  for (const name of entry.names) {
    userBuildingImageMap.set(normalize(name), entry.path);
  }
}

export const resolveUserBuildingImage = (name?: string, fallback?: string) => {
  if (!name) return fallback ?? "";
  const direct = userBuildingImageMap.get(normalize(name));
  if (direct) return direct;

  for (const [key, path] of userBuildingImageMap.entries()) {
    const normalized = normalize(name);
    if (normalized.includes(key) || key.includes(normalized)) {
      return path;
    }
  }

  return fallback ?? "";
};
