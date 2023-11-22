import { UserAvatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { Icon, Icons } from "@/components/Icon";
import { SettingsCard } from "@/components/layout/SettingsCard";
import { AuthInputBox } from "@/components/text-inputs/AuthInputBox";
import { useAuth } from "@/hooks/auth/useAuth";

export function AccountEditPart() {
  const { logout } = useAuth();

  return (
    <SettingsCard paddingClass="px-8 py-10" className="!mt-8">
      <div className="grid lg:grid-cols-[auto,1fr] gap-8">
        <div>
          <UserAvatar
            iconClass="text-5xl"
            sizeClass="w-32 h-32"
            bottom={
              <div className="text-xs flex gap-2 items-center bg-editBadge-bg text-editBadge-text hover:bg-editBadge-bgHover py-1 px-3 rounded-full cursor-pointer">
                <Icon icon={Icons.EDIT} />
                Edit
              </div>
            }
          />
        </div>
        <div>
          <div className="space-y-8 max-w-xs">
            <AuthInputBox label="Account name" placeholder="Muad'Dib" />
            <AuthInputBox label="Device name" placeholder="Fremen tablet" />
            <div className="flex space-x-3">
              <Button theme="purple">Save account</Button>
              <Button theme="danger" onClick={logout}>
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
