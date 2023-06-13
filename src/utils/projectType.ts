export const projectTypes = [
  "發表期刊論文",
  "會議論文",
  "專書及技術報告",
  "國科會計畫",
  "產學合作計畫",
  "校外獎勵及指導學生獲獎",
  "校內獎勵及指導學生獲獎",
  "校內外演講",
  "專書論文",
  "教材及作品",
];

const getProjectType = (id: number | string) => {
  id = Number(id);
  if (id >= 0 && id <= 9) {
    return projectTypes[id];
  }

  return "其他";
};

export default getProjectType;
