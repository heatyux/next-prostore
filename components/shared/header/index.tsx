import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import Menu from './menu'
import { CategoriesDrawer } from './categories-drawer'

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategoriesDrawer />
          <Link href="/" className="flex-start ml-4">
            <Image
              src="/images/logo.svg"
              width={48}
              height={48}
              alt={`${APP_NAME} logo`}
              priority={true}
            />
            <span className="ml-3 hidden text-2xl font-bold lg:block">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  )
}

export default Header
