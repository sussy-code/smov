import { useState } from "react";

import { Button } from "@/components/Button";
import { ColorPicker } from "@/components/form/ColorPicker";
import { IconPicker } from "@/components/form/IconPicker";
import { Modal, ModalCard } from "@/components/overlays/Modal";
import { UserIcons } from "@/components/UserIcon";
import { Heading2 } from "@/components/utils/Text";

export interface ProfileEditModalProps {
  id: string;
  close?: () => void;
}

export function ProfileEditModal(props: ProfileEditModalProps) {
  const [colorA, setColorA] = useState("#2E65CF");
  const [colorB, setColorB] = useState("#2E65CF");
  const [userIcon, setUserIcon] = useState<UserIcons>(UserIcons.USER);

  return (
    <Modal id={props.id}>
      <ModalCard>
        <Heading2 className="!mt-0">Edit profile picture</Heading2>
        <div className="space-y-6">
          <ColorPicker label="First color" value={colorA} onInput={setColorA} />
          <ColorPicker
            label="Second color"
            value={colorB}
            onInput={setColorB}
          />
          <IconPicker
            label="User icon"
            value={userIcon}
            onInput={setUserIcon}
          />
        </div>
        <div className="flex justify-center mt-8">
          <Button theme="purple" className="!px-20" onClick={props.close}>
            Finish editing
          </Button>
        </div>
      </ModalCard>
    </Modal>
  );
}
