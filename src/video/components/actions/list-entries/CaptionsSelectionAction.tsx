import { useTranslation } from "react-i18next";

import { Icons } from "@/components/Icon";

import { PopoutListAction } from "../../popouts/PopoutUtils";

interface Props {
  onClick: () => any;
}

export function CaptionsSelectionAction(props: Props) {
  const { t } = useTranslation();

  return (
    <PopoutListAction icon={Icons.CAPTIONS} onClick={props.onClick}>
      {t("videoPlayer.buttons.captions")}
    </PopoutListAction>
  );
}
