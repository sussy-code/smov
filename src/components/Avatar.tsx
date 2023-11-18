import { UserIcon } from "@/components/UserIcon";
import { AccountProfile } from "@/pages/parts/auth/AccountCreatePart";
import { useAuthStore } from "@/stores/auth";

export interface AvatarProps {
  profile: AccountProfile["profile"];
}

export function Avatar(props: AvatarProps) {
  return (
    <div
      className="h-[2em] w-[2em] rounded-full overflow-hidden flex items-center justify-center text-white"
      style={{
        background: `linear-gradient(to bottom right, ${props.profile.colorA}, ${props.profile.colorB})`,
      }}
    >
      <UserIcon icon={props.profile.icon as any} />
    </div>
  );
}

export function UserAvatar() {
  const auth = useAuthStore();
  if (!auth.account) return null;
  return <Avatar profile={auth.account.profile} />;
}
