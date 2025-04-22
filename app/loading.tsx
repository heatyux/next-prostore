import Image from 'next/image'
import loader from '@/assets/loader.gif'

const LoadingPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Image src={loader} width={150} height={150} alt="Loading..." />
    </div>
  )
}

export default LoadingPage
