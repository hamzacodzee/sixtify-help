export const useGetEditorFonts = () => {
  const fontOptions = [
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Times New Roman", value: "'Times New Roman', serif" },
    { label: "Poppins", value: "'Poppins', sans-serif" },
    { label: "Noto Sans Gujarati", value: "'Noto Sans Gujarati', sans-serif" },
    {
      label: "Noto Sans Devanagari (Hindi)",
      value: "'Noto Sans Devanagari', sans-serif",
    },
  ];

  return { fontOptions };
};

