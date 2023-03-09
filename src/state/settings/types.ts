export interface CaptionStyleSettings {
  color: string;
  /**
   * Range is [10, 30]
   */
  fontSize: number;
  fontFamily: string;
  textShadow: string;
  backgroundColor: string;
}

export interface CaptionSettings {
  /**
   * Range is [-10, 10]s
   */
  delay: number;
  style: CaptionStyleSettings;
}

export interface MWSettingsData {
  language: string;
  captionSettings: CaptionSettings;
}
