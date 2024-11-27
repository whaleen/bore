import { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import NodeList from './components/NodeList'
import AccountSettings from './components/AccountSettings'
import WalletConnection from './components/WalletConnection'
import ProxySubmissionForm from './components/ProxySubmissionForm'
import { WalletContext } from './components/WalletContext'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './components/ThemeContext'

function App() {
  const { publicKey } = useContext(WalletContext)
  const publicKeyBase58 = publicKey ? publicKey.toBase58() : null

  return (
    <ThemeProvider>
      <Router>
        <div className='min-h-screen bg-base-100 text-base-content'>
          <nav className='bg-base-200 p-4'>
            <div className='container mx-auto flex justify-between items-center'>
              <div className='flex gap-4'>
                <Link
                  to='/'
                  className='hover:text-primary'
                >
                  Nodes
                </Link>
                <Link
                  to='/account'
                  className='hover:text-primary'
                >
                  Account
                </Link>
                <Link
                  to='/submit'
                  className='hover:text-primary'
                >
                  Submit Node
                </Link>
              </div>
              <div className='flex items-center gap-4'>
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
                    <h1 className='text-2xl font-bold mb-6'>Available Nodes</h1>
                    <NodeList />
                  </>
                }
              />
              <Route
                path='/account'
                element={<AccountSettings />}
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
