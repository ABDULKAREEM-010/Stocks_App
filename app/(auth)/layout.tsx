import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { headers } from 'next/headers'
import { auth } from '@/lib/better-auth/auth'
import { redirect } from 'next/navigation'

const layout = async ({children}:{children:React.ReactNode}) => {
    const session = await auth.api.getSession({headers: await headers()})
    if(session?.user){  
        redirect('/')
    }
    return (
    <main className='auth-layout'>
        <section className='auth-left'>
            <div className="auth-left-inner">
                <Link href='/' className='auth-logo'>
                    <img src='/assets/icons/logo.svg' alt='Signalist Logo' width={140} height={32} className='h-8 w-auto' />
                </Link>
                <div className="flex-1 pb-8">{children}</div>
            </div>
        </section>
        <section className='auth-right'>
            <div className='auth-right-content'>
                <blockquote className='auth-blockquote'>
                    Signalist turned my watchlist into a winning list. The alerts are spot-on, and I feel more confident making moves in the market
                </blockquote>
                <div className="flex items-center justify-between">
                    <div>
                        <cite className="auth-testimonial-author">- Ethan R.</cite>
                        <p className="max-md:text-xs text-gray-500">Retail Investor</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Image src="/assets/icons/star.svg" alt="Star" key={star} width={20} height={20} className="w-5 h-5" />
                        ))}
                    </div>
                </div>
            </div>
            <div className='auth-right-image'>
                <Image src={'/assets/images/dashboard.png'} alt='dashboard preview' width={1440} height={1150} className="auth-dashboard-preview" />
            </div>
        </section>
    </main>
  )
}

export default layout