import { KanaType } from "@/types";

export interface TableColumn {
  key: string;
  header: string;
}

export const getKanaTableColumns = (kanaType: KanaType): TableColumn[] => [
  {
    key: "kana",
    header: kanaType === "hiragana" ? "Hiragana" : "Katakana",
  },
  { key: "romaji", header: "Romaji" },
  { key: "correctCount", header: "Correct Answers" },
  { key: "totalCount", header: "Total Answers" },
  { key: "accuracy", header: "Accuracy (%)" },
];
