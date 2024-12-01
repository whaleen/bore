// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import NodeList from './components/NodeList'
import AccountSettings from './components/AccountSettings'
import WalletConnection from './components/WalletConnection'
import ProxySubmissionForm from './components/ProxySubmissionForm'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './components/ThemeContext'
import { useWallet } from '@solana/wallet-adapter-react'
import RegisterPage from './components/RegisterPage'

function App() {
  const { publicKey } = useWallet()

  return (
    <ThemeProvider>
      <Router>
        <div className='min-h-screen bg-base-100 text-base-content'>
          <nav className='navbar bg-base-200 p-4'>
            <div className='container mx-auto'>
              {/* Left Section: Logo and Links */}
              <div className='flex-1 flex items-center gap-4'>
                <Link
                  to='/'
                  className='flex items-center gap-2 hover:text-primary'
                >
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 900 900'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <g id='Group'>
                      <path
                        id='Circular-Outer'
                        fill='#01D452'
                        fill-rule='evenodd'
                        stroke='none'
                        d='M 450 900 C 201.472229 900 0 698.527893 0 450 C 0 201.472107 201.472229 0 450 0 C 698.527832 0 900 201.472107 900 450 C 900 698.527893 698.527832 900 450 900 Z M 450 830.232544 C 659.996399 830.232544 830.232544 659.996399 830.232544 450 C 830.232544 240.003601 659.996399 69.767456 450 69.767456 C 240.003586 69.767456 69.767448 240.003601 69.767448 450 C 69.767448 659.996399 240.003586 830.232544 450 830.232544 Z'
                      />
                      <path
                        id='Shape-Middle'
                        fill='#01D452'
                        fill-rule='evenodd'
                        stroke='none'
                        d='M 450 668 C 329.602112 668 232 570.397949 232 450 C 232 329.602051 329.602112 232 450 232 C 570.397888 232 668 329.602051 668 450 C 668 570.397949 570.397888 668 450 668 Z M 450 634.201538 C 551.731567 634.201538 634.201599 551.731567 634.201599 450 C 634.201599 348.268433 551.731567 265.798401 450 265.798401 C 348.268402 265.798401 265.798462 348.268433 265.798462 450 C 265.798462 551.731567 348.268402 634.201538 450 634.201538 Z'
                      />
                    </g>
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
                {/* <div className='hidden lg:flex gap-4'>
                  <Link
                    to='/register'
                    className='hover:text-primary'
                  >
                    Register
                  </Link>
                </div> */}
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
                    <h1 className='text-2xl font-bold mb-6'>Node Directory</h1>
                    <NodeList />
                  </>
                }
              />
              <Route
                path='/account'
                element={<AccountSettings />}
              />
              <Route
                path='/register'
                element={<RegisterPage />}
              />
              <Route
                path='/submit'
                element={<ProxySubmissionForm />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
