import Link from 'next/link'
import React from 'react'
import DesktopNavbar from './DesktopNavbar'
import MobileNavbar from './MobileNavbar'
import { currentUser } from '@clerk/nextjs/server'
import { syncUser } from '@/actions/user'
import SearchInput from './SearchInput'
import Image from 'next/image'
import logo from '../../public/icons/paw-512-white.png'

async function Navbar() {
  
  const user = await currentUser();
  if (user) await syncUser();

  return (
    <nav className="sticky top-0 w-full border bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center min-w-10">
            <Link href="/" className="mr-1 text-base sm:text-lg font-bold text-primary-foreground font-poppins tracking-wider whitespace-nowrap">
              <div className='flex items-center gap-2'>
                <Image
                  src={logo}
                  width={35}
                  height={35}
                  alt="Logo Icon"

                  priority={true}
                />
                <span className='hidden sm:block'>Track Pet</span>
              </div>
            </Link>
          </div>
          <SearchInput />
          <DesktopNavbar />
          <MobileNavbar />
        </div>
      </div>
    </nav>
  )
}

export default Navbar