export const formatViews = (num) => {
  if (num === null || num === undefined || num === 0) return "0";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString();
};