import { Button } from "@/components/Button";
import { Modal, ModalCard } from "@/components/overlays/Modal";
import { Heading2 } from "@/components/utils/Text";

export function ProfileEditModal(props: { id: string }) {
  return (
    <Modal id={props.id}>
      <ModalCard>
        <Heading2 className="!mt-0">Edit profile?</Heading2>
        <p>I am existing</p>
        <Button theme="danger">Update</Button>
      </ModalCard>
    </Modal>
  );
}
