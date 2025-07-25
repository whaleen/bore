// import { Artwork } from './artwork/Artwork'

interface EmptyPrimaryNodeProps {
  onBrowse?: () => void;
}

export const EmptyPrimaryNode = ({ onBrowse }: EmptyPrimaryNodeProps) => {
  return (
    <div className="p-6 border border-base-100  shadow-lg hover:shadow-2xl transition-all">
      <div className="flex items-center justify-center py-12 text-sm text-content">
        <span>
          No default set.{' '}
          {onBrowse ? (
            <button onClick={onBrowse} className="link">
              Browse the directory
            </button>
          ) : (
            <a href="/" className="link">
              Browse the directory
            </a>
          )}

        </span>
      </div>
      <div className="opacity-20">
        {/* <Artwork /> */}
      </div>
    </div>
  )
}
