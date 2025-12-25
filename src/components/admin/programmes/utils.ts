export const AVAILABLE_CATEGORIES = [
  "Wellness",
  "Fitness",
  "Nutrition",
  "Mental Health",
  "Meditation",
  "Yoga",
  "Mindfulness",
  "Stress Management",
  "Sleep",
  "Personal Development",
];

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

