import { Icons } from "@/components/Icon";
import { useTranslation } from "react-i18next";
import { PopoutListAction } from "../../popouts/PopoutUtils";
import { QualityDisplayAction } from "./QualityDisplayAction";

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
