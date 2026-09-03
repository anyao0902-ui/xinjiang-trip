// 北疆 11 日游行程数据（来自 xinjiang_plan.txt 报价单）
// coord: [纬度, 经度]，高德初始化时统一翻转成 [经,纬]
export const ITINERARY = [
  { date:"9月24日", name:"乌鲁木齐", coord:[43.8256,87.6168], hotel:"建国·璞隐酒店", room:"暗香居大床房", summary:"乌鲁木齐落地接机", type:"start" },
  { date:"9月25日", name:"阿勒泰", coord:[47.8300,88.1400], waypoints:["521沙漠公路","克拉美丽沙漠公路","将军山日落"], hotel:"丽呈别院酒店", room:"栖山·奇妙大床房", miles:"510KM · 5.5h", summary:"乌鲁木齐—521沙漠公路—克拉美丽沙漠公路—将军山日落（云顶缆车上·山顶DJ派对·星空蹦迪）" },
  { date:"9月26日", name:"禾木村", coord:[48.5600,87.0300], waypoints:["阿禾公路","哈登观景台","禾木桥","远眺美丽峰"], hotel:"禾木树说民宿", room:"A1白桦树观景Loft大床房", miles:"220KM · 4h", summary:"阿勒泰—阿禾公路—禾木村（观景台·禾木桥·远眺美丽峰）篝火晚会·自由观星" },
  { date:"9月27日", name:"白哈巴村", coord:[48.7000,86.7600], hotel:"森与鹿民宿", room:"落叶松高级大床房·日落伴山·慵懒角落", miles:"151KM · 4h", summary:"禾木村游玩—白哈巴村" },
  { date:"9月28日", name:"喀纳斯·观鱼台", coord:[48.7200,87.0100], hotel:"森与鹿民宿", room:"落叶松高级大床房·日落伴山·慵懒角落", miles:"26KM · 50分钟", summary:"白哈巴—喀纳斯观鱼台" },
  { date:"9月29日", name:"布尔津", coord:[47.7000,86.8700], waypoints:["喀纳斯三湾","布尔津五彩滩","童话小镇"], hotel:"布尔津Taiyue泰悦假日酒店", room:"舒适大床房", miles:"142KM · 2.5h", summary:"喀纳斯三湾—布尔津五彩滩—布尔津童话小镇" },
  { date:"9月30日", name:"奎屯", coord:[44.4200,84.8900], waypoints:["乌尔禾魔鬼城"], hotel:"奎屯明宇丽呈酒店(奎屯站店)", room:"特惠大床房", miles:"456KM · 5h", summary:"布尔津—魔鬼城—奎屯" },
  { date:"10月1日", name:"赛里木湖", coord:[44.6000,81.1500], hotel:"FF设计师酒店(赛里木湖店)", room:"高级浴缸大床房", miles:"307KM · 3.5h", summary:"奎屯—赛里木湖 · 住赛湖" },
  { date:"10月2日", name:"精河", coord:[44.6600,82.8900], waypoints:["伊宁六星街"], hotel:"全季酒店", room:"高级大床房", miles:"341KM · 5h", summary:"赛湖游玩—伊宁六星街—精河" },
  { date:"10月3日", name:"乌鲁木齐", coord:[43.8256,87.6168], waypoints:["安集海大峡谷","石河子美食"], hotel:"建国·璞隐酒店", room:"暗香居大床房", miles:"420KM · 4.5h", summary:"精河—安集海大峡谷—石河子美食—乌鲁木齐" },
  { date:"10月4日", name:"乌鲁木齐", coord:[43.8256,87.6168], hotel:"—", room:"返程送机", summary:"乌鲁木齐返程送机", type:"end" }
];

export const TOTAL_MILES = "3104 公里";
export const DAY_COUNT = ITINERARY.length;
