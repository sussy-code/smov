import { useTranslation } from "react-i18next";

import { Icons } from "@/components/Icon";

import { QualityDisplayAction } from "./QualityDisplayAction";
import { PopoutListAction } from "../../popouts/PopoutUtils";

interface Props {
  onClick?: () => any;
}

export function SourceSelectionAction(props: Props) {
  const { t } = useTranslation();

  return (
    <PopoutListAction
      icon={Icons.CLAPPER_BOARD}
      onClick={props.onClick}
      right={<QualityDisplayAction />}
      noChevron
    >
      {t("videoPlayer.buttons.source")}
    </PopoutListAction>
  );
}
