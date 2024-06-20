import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../../context/langContext'
import { content, ContentMap } from '../../localization/content'

interface FormField {
    id: number
    title_uz: string
    title_uzc: string
    type: string
}

const Form: React.FC = () => {

    const [fields, setFields] = useState<FormField[]>([])
    const [formData, setFormData] = useState<{ [key: number]: any }>({})

    const langContext = useContext(Context)

    if (!langContext) {
        throw new Error('useContext must be inside a Provider with a valid value')
    }

    const { lang } = langContext

    const contents = content[lang as keyof ContentMap]


    useEffect(() => {
        // API ma'lumotlarini olish
        fetch('https://web.app.orzugrand.uz/api/questions')
            .then(response => response.json())
            .then(data => {
                setFields(data)
                const initialFormData = data.reduce((acc: any, field: FormField) => {
                    acc[field.id] = field.type === "3" ? null : ''
                    return acc
                }, {})
                setFormData(initialFormData)
            })
            .catch(error => console.error('Error fetching form fields:', error))
    }, [])

    const handleChange = (id: number, value: any) => {
        console.log(setFormData({ ...formData, [id]: value }))
        setFormData({ ...formData, [id]: value })
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        const submissionData = {
            chat_id: 5997114437,
            answers: fields.map(field => ({
                question_id: field.id,
                question_value: formData[field.id]
            }))
        }
        console.log('Form data submitted:', submissionData)

        fetch('http://web.app.orzugrand.uz/api/setAnswer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submissionData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Form submitted successfully:', data)
            })
            .catch(error => {
                console.error('Error submitting form:', error)
            })
    }

    const renderInputField = (field: FormField) => {
        switch (field.type) {
            case "2":
                return (
                    <input
                        type="text"
                        className='border-[1px] border-slate-200 w-full p-[10px] rounded-[10px] outline-none'
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                    />
                )
            case "3":
                return (
                    <input
                        type="file"
                        className='p-[10px]'
                        onChange={(e) => handleChange(field.id, e.target.files ? e.target.files[0] : null)}
                    />
                )
            default:
                return null
        }
    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-[20px] p-[20px]'>
            {fields.map(field => (
                <div key={field.id} className='flex flex-col gap-[5px]'>
                    <label className='text-gray-500 text-[14px]'>{field[`title_${lang}`]}</label>
                    {renderInputField(field)}
                </div>
            ))}
            <button type="submit" className="fixed bottom-0 left-0 w-full text-center bg-orange-500 px-[20px] py-[15px] text-white">{contents.submit}</button>
        </form>
    )
}

export default Form