interface NoDeviceProps {
  onGenerateCode?: () => void;
  isGeneratingCode?: boolean;
}

export const NoDevice = ({ onGenerateCode, isGeneratingCode = false }: NoDeviceProps) => {
  return (
    <div className="text-center py-8">
      <h2 className="text-xl font-semibold mb-4">Connect a device</h2>
      <p className="text-gray-400 mb-6">
        Generate a code to link a device with your account.
      </p>
      <button
        onClick={onGenerateCode}
        disabled={isGeneratingCode}
        className="btn btn-primary"
      >
        {isGeneratingCode ? 'Generating Code...' : 'Generate Link Code'}
      </button>
    </div>
  )
}
