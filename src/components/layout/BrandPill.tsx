import { Icon, Icons } from 'components/Icon'

export function BrandPill() {

  return (
    <div className="bg-bink-100 bg-opacity-50 text-bink-600 rounded-full flex items-center space-x-2 px-4 py-2">
      <Icon className="text-xl" icon={Icons.MOVIE_WEB} />
      <span className="font-semibold text-white">Movie Web</span>
    </div>
  )
}
