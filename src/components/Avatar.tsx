import classNames from "classnames";

import { UserIcon } from "@/components/UserIcon";
import { AccountProfile } from "@/pages/parts/auth/AccountCreatePart";
import { useAuthStore } from "@/stores/auth";

export interface AvatarProps {
  profile: AccountProfile["profile"];
  sizeClass?: string;
  iconClass?: string;
}

export function Avatar(props: AvatarProps) {
  return (
    <div
      className={classNames(
        props.sizeClass,
        "rounded-full overflow-hidden flex items-center justify-center text-white"
      )}
      style={{
        background: `linear-gradient(to bottom right, ${props.profile.colorA}, ${props.profile.colorB})`,
      }}
    >
      <UserIcon className={props.iconClass} icon={props.profile.icon as any} />
    </div>
  );
}

export function UserAvatar(props: {
  sizeClass?: string;
  iconClass?: string;
  bottom?: React.ReactNode;
}) {
  const auth = useAuthStore();
  if (!auth.account) return null;
  return (
    <div className="relative inline-block">
      <Avatar
        profile={auth.account.profile}
        sizeClass={props.sizeClass ?? "w-[2rem] h-[2rem]"}
        iconClass={props.iconClass}
      />
      {props.bottom ? (
        <div className="absolute bottom-0 left-1/2 transform translate-y-1/2 -translate-x-1/2">
          {props.bottom}
        </div>
      ) : null}
    </div>
  );
}
