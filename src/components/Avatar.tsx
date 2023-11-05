import { Icon, Icons } from "@/components/Icon";
import { AccountProfile } from "@/pages/parts/auth/AccountCreatePart";
import { useAuthStore } from "@/stores/auth";

export interface AvatarProps {
  profile: AccountProfile["profile"];
}

const possibleIcons = ["bookmark"] as const;
const avatarIconMap: Record<(typeof possibleIcons)[number], Icons> = {
  bookmark: Icons.BOOKMARK,
};

export function Avatar(props: AvatarProps) {
  const icon = (avatarIconMap as any)[props.profile.icon] ?? Icons.X;
  return (
    <div
      className="h-[2em] w-[2em] rounded-full overflow-hidden flex items-center justify-center text-white"
      style={{
        background: `linear-gradient(to bottom right, ${props.profile.colorA}, ${props.profile.colorB})`,
      }}
    >
      <Icon icon={icon} />
    </div>
  );
}

export function UserAvatar() {
  const auth = useAuthStore();
  if (!auth.account) return null;
  return <Avatar profile={auth.account.profile} />;
}
