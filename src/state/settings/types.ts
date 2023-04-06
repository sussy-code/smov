import { LangCode } from "@/setup/iso6391";

export interface CaptionStyleSettings {
  color: string;
  /**
   * Range is [10, 30]
   */
  fontSize: number;
  backgroundColor: string;
}

export interface CaptionSettingsV1 {
  /**
   * Range is [-10, 10]s
   */
  delay: number;
  style: CaptionStyleSettings;
}

export interface CaptionSettings {
  language: LangCode;
  /**
   * Range is [-10, 10]s
   */
  delay: number;
  style: CaptionStyleSettings;
}
export interface MWSettingsDataV1 {
  language: LangCode;
  captionSettings: CaptionSettingsV1;
}

export interface MWSettingsData {
  language: LangCode;
  captionSettings: CaptionSettings;
}
