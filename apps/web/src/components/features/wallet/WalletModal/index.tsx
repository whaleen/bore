// apps/web/src/components/features/wallet/WalletModal/index.tsx
import { useWallet, Wallet } from '@solana/wallet-adapter-react'
import { X } from 'lucide-react'
import { WalletModalProps } from './types'
import React from 'react'

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { wallets, select } = useWallet()

  const handleWalletSelect = (wallet: Wallet) => {
    select(wallet.adapter.name)
    onClose()
  }

  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className='modal-box bg-base-200'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-xl font-bold'>Connect Wallet</h3>
          <button
            onClick={onClose}
            className='btn btn-ghost btn-sm btn-square'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='space-y-2'>
          {wallets.map((wallet: Wallet) => (
            <button
              key={wallet.adapter.name}
              onClick={() => handleWalletSelect(wallet)}
              className='w-full bg-base-300 hover:bg-base-100 px-4 py-3  flex items-center justify-between'
              disabled={wallet.adapter.readyState === 'Unsupported'}
            >
              <span className='flex items-center gap-3'>
                {wallet.adapter.icon && (
                  <img
                    src={wallet.adapter.icon}
                    alt={`${wallet.adapter.name} icon`}
                    className='w-6 h-6'
                  />
                )}
                <span>{wallet.adapter.name}</span>
              </span>
              {wallet.adapter.readyState === 'Installed' && (
                <span className='badge badge-success gap-1'>Installed</span>
              )}
            </button>
          ))}
        </div>

        <div className='mt-6 text-sm text-base-content/60 text-center'>
          <p>New to Solana wallets?</p>
          <a
            href='https://solana.com/ecosystem/explore?categories=wallet'
            target='_blank'
            rel='noopener noreferrer'
            className='link link-primary'
          >
            Learn More
          </a>
        </div>
      </div>
      <form
        method='dialog'
        className='modal-backdrop'
      >
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}

export default WalletModal
