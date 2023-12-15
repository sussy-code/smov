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
  language: string;
  /**
   * Range is [-10, 10]s
   */
  delay: number;
  style: CaptionStyleSettings;
}
export interface MWSettingsDataV1 {
  language: string;
  captionSettings: CaptionSettingsV1;
}

export interface MWSettingsData {
  language: string;
  captionSettings: CaptionSettings;
}
