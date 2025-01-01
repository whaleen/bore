interface EmptySavedNodesProps {
  onBrowse?: () => void;
}

export const EmptySavedNodes = ({ onBrowse }: EmptySavedNodesProps) => {
  return (
    <div className="text-center py-8">
      <h2 className="text-xl font-semibold mb-4">No Saved Nodes</h2>
      <p className="text-gray-400 mb-4">
        You haven't saved any nodes yet. Browse the node directory to find
        some nodes to use.
      </p>
      {onBrowse && (
        <button onClick={onBrowse} className="btn btn-primary">
          Browse Directory
        </button>
      )}
    </div>
  )
}
