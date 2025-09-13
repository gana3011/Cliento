import BuyerForm from '@/app/components/BuyerForm'
import { useForm } from 'antd/es/form/Form'
import React from 'react'

const page = () => {

  const [form] = useForm();
  
  return (
    <div>
      <BuyerForm form={form}/>
    </div>
  )
}

export default page
