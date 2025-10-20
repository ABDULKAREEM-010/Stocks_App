import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NavItems from './NavItems'
import UserDropdown from './UserDropdown'
import { searchStocks } from '@/lib/actions/finnhub.action'
import { enrichStocksWithWatchlistStatus } from '@/lib/actions/watchlist.action'


const Header = async ({user}:{user:User}) => {
  const stocks = await searchStocks();
  const initialStocks = await enrichStocksWithWatchlistStatus(stocks);
  return (
    <header className='sticky top-0 header'>
        <div className='container header-wrapper'>
            <Link href="/">
            <Image src={"/assets/icons/logo.svg"} alt="SignaListLogo" width={140} height={32} className='h-8 w-auto cursor-pointer'/>
            </Link>
            <nav className='hidden sm:block'>
                <NavItems initialStocks={initialStocks} />
            </nav>
            <UserDropdown user={user} initialStocks={initialStocks} />
        </div>
    </header>
  )
}

export default Header