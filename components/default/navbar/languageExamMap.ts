export type LanguageKey = "english" | "chinese" | "japanese";

export const LANGUAGE_META: Record<
  LanguageKey,
  { label: string; accent: string; tag: string }
> = {
  english: { label: "ENGLISH", accent: "#F26E91", tag: "PTE/IELTS/TOEFL" },
  chinese: { label: "中文", accent: "#DE2910", tag: "HSK/写作" },
  japanese: { label: "JAPANESE", accent: "#a855f7", tag: "JLPT" },
};

export const EXAMS: Record<
  LanguageKey,
  Array<{ key: string; label: string; tag: string }>
> = {
  english: [
    { key: "pte", label: "PTE", tag: "ENGLISH" },
    { key: "ielts", label: "IELTS", tag: "ENGLISH" },
    { key: "toefl", label: "TOEFL", tag: "ENGLISH" },
    { key: "cet", label: "CET-4/6", tag: "CHINA" },
  ],
  chinese: [
    { key: "hsk", label: "HSK", tag: "中文" },
    { key: "writing", label: "写作", tag: "中文" },
    { key: "reading", label: "阅读", tag: "中文" },
  ],
  japanese: [
    { key: "jlpt", label: "JLPT", tag: "JAPANESE" },
    { key: "kana", label: "KANA", tag: "JAPANESE" },
  ],
};
