import classNames from "classnames";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import { base64ToBuffer, decryptData } from "@/backend/accounts/crypto";
import { UserAvatar } from "@/components/Avatar";
import { Icon, Icons } from "@/components/Icon";
import { Transition } from "@/components/Transition";
import { useAuth } from "@/hooks/auth/useAuth";
import { conf } from "@/setup/config";
import { useAuthStore } from "@/stores/auth";

function Divider() {
  return <hr className="border-0 w-full h-px bg-dropdown-border" />;
}

function GoToLink(props: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}) {
  const history = useHistory();

  const goTo = (href: string) => {
    if (href.startsWith("http")) window.open(href, "_blank");
    else history.push(href);
  };

  return (
    <a
      href={props.href}
      onClick={(evt) => {
        evt.preventDefault();
        if (props.href) goTo(props.href);
        else props.onClick?.();
      }}
      className={props.className}
    >
      {props.children}
    </a>
  );
}

function DropdownLink(props: {
  children: React.ReactNode;
  href?: string;
  icon?: Icons;
  highlight?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <GoToLink
      onClick={props.onClick}
      href={props.href}
      className={classNames(
        "tabbable cursor-pointer flex gap-3 items-center m-3 p-1 rounded font-medium transition-colors duration-100",
        props.highlight
          ? "text-dropdown-highlight hover:text-dropdown-highlightHover"
          : "text-dropdown-text hover:text-white",
        props.className
      )}
    >
      {props.icon ? <Icon icon={props.icon} className="text-xl" /> : null}
      {props.children}
    </GoToLink>
  );
}

function CircleDropdownLink(props: { icon: Icons; href: string }) {
  return (
    <GoToLink
      href={props.href}
      className="tabbable w-11 h-11 rounded-full bg-dropdown-contentBackground text-dropdown-text hover:text-white transition-colors duration-100 flex justify-center items-center"
    >
      <Icon className="text-2xl" icon={props.icon} />
    </GoToLink>
  );
}

export function LinksDropdown(props: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const deviceName = useAuthStore((s) => s.account?.deviceName);
  const seed = useAuthStore((s) => s.account?.seed);
  const bufferSeed = useMemo(
    () => (seed ? base64ToBuffer(seed) : null),
    [seed]
  );
  const { logout } = useAuth();

  useEffect(() => {
    function onWindowClick(evt: MouseEvent) {
      if ((evt.target as HTMLElement).closest(".is-dropdown")) return;
      setOpen(false);
    }

    window.addEventListener("click", onWindowClick);
    return () => window.removeEventListener("click", onWindowClick);
  }, []);

  const toggleOpen = useCallback(() => {
    console.log("yay");
    setOpen((s) => !s);
  }, []);

  return (
    <div className="relative is-dropdown">
      <div
        className="cursor-pointer tabbable rounded-full"
        tabIndex={0}
        onClick={toggleOpen}
        onKeyUp={(evt) => evt.key === "Enter" && toggleOpen()}
      >
        {props.children}
      </div>
      <Transition animation="slide-down" show={open}>
        <div className="rounded-lg absolute w-64 bg-dropdown-altBackground top-full mt-3 right-0">
          {deviceName && bufferSeed ? (
            <DropdownLink className="text-white" href="/settings">
              <UserAvatar />
              {decryptData(deviceName, bufferSeed)}
            </DropdownLink>
          ) : (
            <DropdownLink href="/login" icon={Icons.RISING_STAR} highlight>
              Sync to cloud
            </DropdownLink>
          )}
          <Divider />
          <DropdownLink href="/settings" icon={Icons.SETTINGS}>
            Settings
          </DropdownLink>
          <DropdownLink href="/faq" icon={Icons.EPISODES}>
            About us
          </DropdownLink>
          <DropdownLink href="/faq" icon={Icons.FILM}>
            HELP MEEE
          </DropdownLink>
          {deviceName ? (
            <DropdownLink
              className="!text-type-danger opacity-75 hover:opacity-100"
              icon={Icons.LOGOUT}
              onClick={logout}
            >
              Log out
            </DropdownLink>
          ) : null}
          <Divider />
          <div className="my-4 flex justify-center items-center gap-4">
            <CircleDropdownLink
              href={conf().DISCORD_LINK}
              icon={Icons.DISCORD}
            />
            <CircleDropdownLink href={conf().GITHUB_LINK} icon={Icons.GITHUB} />
            <CircleDropdownLink
              href={conf().DONATION_LINK}
              icon={Icons.COINS}
            />
          </div>
        </div>
      </Transition>
    </div>
  );
}
