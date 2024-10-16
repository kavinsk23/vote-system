import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-inter">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 bg-white shadow-lg rounded-lg my-8" style={{
        backgroundImage: 'url("/public/background-pattern.png")',
        backgroundRepeat: 'repeat',
        backgroundSize: '100px'
      }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout