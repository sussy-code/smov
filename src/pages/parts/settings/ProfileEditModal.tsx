import { Button } from "@/components/buttons/Button";
import { ColorPicker } from "@/components/form/ColorPicker";
import { IconPicker } from "@/components/form/IconPicker";
import { Modal, ModalCard } from "@/components/overlays/Modal";
import { UserIcons } from "@/components/UserIcon";
import { Heading2 } from "@/components/utils/Text";

export interface ProfileEditModalProps {
  id: string;
  close?: () => void;
  colorA: string;
  setColorA: (s: string) => void;
  colorB: string;
  setColorB: (s: string) => void;
  userIcon: UserIcons;
  setUserIcon: (s: UserIcons) => void;
}

export function ProfileEditModal(props: ProfileEditModalProps) {
  return (
    <Modal id={props.id}>
      <ModalCard>
        <Heading2 className="!mt-0">Edit profile picture</Heading2>
        <div className="space-y-6">
          <ColorPicker
            label="First color"
            value={props.colorA}
            onInput={props.setColorA}
          />
          <ColorPicker
            label="Second color"
            value={props.colorB}
            onInput={props.setColorB}
          />
          <IconPicker
            label="User icon"
            value={props.userIcon}
            onInput={props.setUserIcon}
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
