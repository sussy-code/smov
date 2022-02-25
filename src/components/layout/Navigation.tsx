import { IconPatch } from "components/buttons/IconPatch";
import { Icons } from "components/Icon";
import { DISCORD_LINK, GITHUB_LINK } from "mw_constants";
import { BrandPill } from "./BrandPill";

export function Navigation() {
  return (
    <div className="flex justify-between items-center absolute left-0 right-0 top-0 py-5 px-7">
      <div>
        <BrandPill />
      </div>
      <div className="flex">
        <a href={DISCORD_LINK} target="_blank" className="text-2xl text-white"><IconPatch icon={Icons.DISCORD} clickable/></a>
        <a href={GITHUB_LINK} target="_blank" className="text-2xl text-white"><IconPatch icon={Icons.GITHUB} clickable/></a>
      </div>
    </div>
  )
}
