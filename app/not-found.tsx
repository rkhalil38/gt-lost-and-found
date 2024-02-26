import UnivHeader from '@/components/UnivHeader'

const NotFound = () => {
    return (
        <div className='flex flex-col gap-2 items-center bg-mainTheme justify-center w-screen h-screen'>
            <h1 className='bg-gradient-to-b from-gtGold to-white text-transparent bg-clip-text text-3xl font-semibold'>GT Lost and Found</h1>
            <h1 className='text-3xl'>404 - Item Already Claimed or Page Does Not Exist</h1>
        </div>
    )
}

export default NotFound