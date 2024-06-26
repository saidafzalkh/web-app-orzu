import { useContext } from 'react'
import { FaArrowLeft } from "react-icons/fa"
import { NavLink, useParams } from 'react-router-dom'
import Loading from '../../components/loading/loading'
import { Context } from '../../context/langContext'
import useFetchData from '../../hooks/useFetchers'
import useTelegramTheme from '../../hooks/useTelegramTheme'


interface CategoryData {
    data: {
        children: any
    }
}

function CategoriesChildren() {

    const langContext = useContext(Context)
    const theme = useTelegramTheme()

    if (!langContext) {
        throw new Error('useContext must be inside a Provider with a valid value')
    }

    const { slug } = useParams<{ slug: string }>()
    const { lang } = langContext

    const { data, loading, error } = useFetchData<CategoryData>(`https://app.orzugrand.uz/api/frontend/categories/${slug}`)

    if (loading) {
        return <Loading />
    }

    if (error || !data) {
        return <div>Xatolik yuz berdi: {error}</div>
    }

    return (
        <>
            <NavLink to={'/'} style={theme == 'dark' ? { backgroundColor: '#27314a', color: 'white', borderColor: '#27314a' } : {}} className="flex items-center justify-center w-[40px] h-[40px] border-[1px] border-slate-200 rounded-full m-[20px]">
                <FaArrowLeft />
            </NavLink>
            <ul className='grid grid-cols-2 gap-4 px-[20px] pb-[20px]'>
                {
                    data?.data?.children?.map((item: any, index: number) => {
                        return (
                            <NavLink to={`/children_inner/${item.slug}`} key={index}>
                                <li style={theme == 'dark' ? { backgroundColor: '#27314a', color: 'white', borderColor: '#27314a' } : {}} className='flex flex-col items-center p-[10px] gap-[5px] rounded-[10px] border-[1px] border-slate-200 cursor-pointer  duration-500 ease-in-out hover:border-[#ffa500]'>
                                    <img className='w-[100px] h-[80px]' src={item.image} alt="" />
                                    <span>{item[`title_${lang}`].length > 20 ? item[`title_${lang}`].slice(0, 20) + '...' : item[`title_${lang}`]}</span>
                                </li>
                            </NavLink>
                        )
                    })
                }
            </ul>
        </>
    )
}

export default CategoriesChildren