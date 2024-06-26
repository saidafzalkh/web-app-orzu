import { useContext } from 'react'
import { GrDeliver } from "react-icons/gr"
import { SlBasket } from 'react-icons/sl'
import { useNavigate, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react"
import Loading from '../../components/loading/loading'
import { Context } from '../../context/langContext'
import { ShoppingCartContext } from '../../context/shoppingCartContext'
import useFetchData from '../../hooks/useFetchers'
import { content, ContentMap } from '../../localization/content'

import type { NotificationArgsProps } from 'antd'
import { notification } from 'antd'
import { FaArrowLeft } from 'react-icons/fa'
import "swiper/css"
import useTelegramTheme from '../../hooks/useTelegramTheme'
interface CategoryData {
    data: any
}

type NotificationPlacement = NotificationArgsProps['placement']

function CategoriesItem() {

    const shoppingContext = useContext(ShoppingCartContext)
    const langContext = useContext(Context)
    const theme = useTelegramTheme()
    const navigate = useNavigate()
    const { slug } = useParams()
    const [api, contextHolder] = notification.useNotification()

    const goBack = () => {
        navigate(-1) // Bu oldingi sahifaga qaytaradi
    }

    const { data, loading, error } = useFetchData<CategoryData>(`https://app.orzugrand.uz/api/frontend/products/view/${slug}`)

    const product = data?.data

    if (!shoppingContext) {
        throw new Error('useContext must be inside a Provider with a valid value')
    }

    if (!langContext) {
        throw new Error('useContext must be inside a Provider with a valid value')
    }

    if (loading) {
        return <Loading />
    }

    if (error || !data) {
        return <div>Xatolik yuz berdi: {error}</div> // Xatolik bo'lsa xato xabarni qaytarish
    }

    const { lang } = langContext

    const { addToCart } = shoppingContext

    const xabarlar = content[lang as keyof ContentMap]

    const openNotification = (placement: NotificationPlacement) => {
        api.success({
            message: `${xabarlar.notification}`,
            placement,
        })
    }

    function formatUzbekSom(price: number) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }

    return (
        <section className='p-[20px] py-0 pb-0 relative'>
            {contextHolder}
            <button onClick={goBack} style={theme == 'dark' ? { backgroundColor: '#27314a', color: 'white', borderColor: '#27314a' } : {}} className="flex items-center justify-center w-[40px] h-[40px] border-[1px] border-slate-200 rounded-full mb-[25px]">
                <FaArrowLeft />
            </button>
            <Swiper className="mySwiper mb-[25px]">
                {
                    product.images.map((item: any, index: number) => {
                        return (
                            <SwiperSlide key={index}>
                                <img className='w-full h-[350px] object-cover' src={item.image} alt="" />
                            </SwiperSlide>
                        )
                    })
                }

            </Swiper>
            <div className='flex flex-col gap-[10px] items-start'>
                <div style={theme == 'dark' ? { color: 'white' } : {}} className='text-[18px]'>{product[`title_${lang}`]}</div>
                <div className='text-[18px] text-[#ffa500]'>{`${formatUzbekSom(product.price)} ${xabarlar.som}`}</div>
                <span className='text-[12px] bg-[#F16736] text-white p-[4px] rounded-[5px]'>{`${formatUzbekSom(product.monthly_pay)} ${xabarlar.som} * 1 oy`}</span>

                <div className='flex items-center gap-[5px]'>
                    <div className='flex items-center gap-[5px] bg-green-500 text-white rounded-[5px] p-[4px] text-[12px]  mb-[8px]'><GrDeliver className='text-[#fff] text-[20px]' />{product.delivery_information[`name_${lang}`]}:</div>
                    <span className='text-[14px] text-gray-500'>{product.delivery_information[`short_description_${lang}`]}</span>
                </div>

                <div style={theme == 'dark' ? { color: 'white' } : {}} className='text-[22px] mb-[5px]'>Tavsifi</div>
                <p className='text-[14px] text-[#999] mb-[100px]'>{product[`description_${lang}`]}</p>
            </div>
            <div style={theme == 'dark' ? { backgroundColor: '#27314a', borderColor: '#27314a' } : {}} className='flex items-center justify-between absolute px-[20px] bottom-0 left-0 w-full h-[60px] bg-white border-t-[1px] border-slate-200'>
                <div className='text-[22px] font-bold text-[#ffa500]'>{`${formatUzbekSom(product.price)} ${xabarlar.som}`}</div>

                <button className='flex flex-col items-center justify-center text-[18px] w-[100px] h-[40px] text-green-500 border-[1px] border-green-500 rounded-[8px]' onClick={() => {
                    addToCart(product)
                    openNotification('bottomRight')
                }}>
                    <SlBasket />
                </button>
            </div>
        </section>
    )
}

export default CategoriesItem