// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { WalletContextProvider } from './components/context/WalletContext'
import NodeDirectoryPage from './components/pages/NodeDirectoryPage'
import AccountPage from './components/pages/AccountPage'
import RegisterPage from './components/pages/RegisterPage'
import WalletConnection from './components/features/wallet/WalletConnection'
import ProxySubmissionForm from './components/features/node/ProxySubmissionForm'
import VultrNodeCreator from './components/features/node/VultrNodeCreator'
import { ThemeToggle, ThemeProvider } from './components/ui/theme'
import { useWallet } from '@solana/wallet-adapter-react'

function App() {
  const { publicKey } = useWallet()

  // Add callback to handle theme changes
  const handleThemeChange = async (newTheme: 'light' | 'dark') => {
    if (publicKey?.toBase58()) {
      try {
        await fetch('/.netlify/functions/auth-users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: publicKey.toBase58(),
            theme: newTheme,
          }),
        })
      } catch (error) {
        console.error('Failed to save theme preference:', error)
      }
    }
  }

  return (
    <WalletContextProvider>
      <ThemeProvider
        initialTheme='dark'
        onThemeChange={handleThemeChange}
        storageKey='bore-theme'
      >
        <Router>
          <div className='min-h-screen text-base-content'>
            <nav className='navbar p-4'>
              <div className='container mx-auto'>
                {/* Left Section: Logo and Links */}
                <div className='flex-1 flex items-center gap-4'>
                  <Link
                    to='/'
                    className='flex items-center gap-2 hover:text-primary'
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" >
                      <path id="Ellipse" fill="currenCOlor" stroke="none" d="M 45 25.03125 C 45 13.968296 36.031704 5 24.96875 5 C 13.905796 5 4.9375 13.968296 4.9375 25.03125 C 4.9375 36.094204 13.905796 45.0625 24.96875 45.0625 C 36.031704 45.0625 45 36.094204 45 25.03125 Z" />
                    </svg>
                  </Link>

                  {!publicKey && (
                    <div className='hidden lg:flex gap-4'>
                      <Link
                        to='/register'
                        className='hover:text-primary'
                      >
                        Register
                      </Link>
                    </div>
                  )}
                  <div className='hidden lg:flex gap-4'>
                    <Link
                      to='/vultr'
                      className='hover:text-primary'
                    >
                      Vultr Instances
                    </Link>
                    <Link
                      to='/register'
                      className='hover:text-primary'
                    >
                      Register
                    </Link>
                  </div>
                </div>

                {/* Right Section: Theme Toggle and Wallet Connection */}
                <div className='flex-none flex items-center gap-4'>
                  <ThemeToggle />
                  <WalletConnection />
                </div>
              </div>
            </nav>

            <div className='container mx-auto p-4'>
              <Routes>
                <Route
                  path='/'
                  element={
                    <>
                      <h1 className='text-2xl font-bold mb-6'>
                        Node Directory
                      </h1>
                      <NodeDirectoryPage />
                    </>
                  }
                />
                <Route
                  path='/account'
                  element={<AccountPage />}
                />
                <Route
                  path='/register'
                  element={<RegisterPage />}
                />
                <Route
                  path='/submit'
                  element={<ProxySubmissionForm />}
                />
                <Route
                  path='/vultr'
                  element={<VultrNodeCreator />}
                />
              </Routes>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </WalletContextProvider>
  )
}

export default App
