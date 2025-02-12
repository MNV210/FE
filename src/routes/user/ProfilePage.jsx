import React, { useEffect, useState } from 'react'
import { Bell, User } from 'lucide-react'
import { CoursesApi } from '../../api/CoursesApi'
import defaultImage from '../../assets/default.jpg' // Assuming you have a default image
import { message, Modal, Input, Form } from 'antd'
import { UserApi } from '../../api/UserApi'

export const ProfilePage = () => {
  const [courseUserRegister, setCourseUserRegister] = useState([])
  const [storedUser, setStoredUser] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    const fetchCourseData = async () => {
      const user = JSON.parse(localStorage.getItem('user'))
      setStoredUser(user)
      const response = await CoursesApi.getCourseUserRegister({ user_id: user.info.id })
      setCourseUserRegister(response.data)
      console.log(response.data)
    }

    fetchCourseData()
  }, [])

  const calculateMembershipDuration = (createdAt) => {
    const createdDate = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now - createdDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays < 30) {
      return `${diffDays} ngày`
    } else {
      const diffMonths = Math.floor(diffDays / 30)
      return `${diffMonths} tháng`
    }
  }

  const handleChangePassword = async (values) => {
    try {
      const response = await UserApi.ChangePassword({ 
        user_id: storedUser.info.id, 
        password: values.password, 
        password_old: values.password_old 
      })
      if (response.status === 200) {
        message.success(response.message)
        setIsModalVisible(false)
        form.resetFields()
      } else {
        message.error(response.message)
      }
    } catch (error) {
      console.log(error)
      message.error('Đổi mật khẩu thất bại')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-10 mb-10">
      {/* Header with gradient */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-400 via-blue-300 to-pink-300">
          <div className="absolute text-white text-lg font-mono top-1/2 left-1/2 transform -translate-x-1/2">
            document.write('Hello, World');
          </div>
        </div>
        
        {/* Profile section */}
        <div className="absolute -bottom-16 left-8">
          <div className="w-32 h-32 bg-gray-200 rounded-full">
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
              <User size={48} className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile content */}
      <div className="pt-20 px-8">
        <div className='flex items-center justify-between'>
          <h1 className="text-2xl font-bold mb-6">Minh Nguyễn</h1>
          <button onClick={() => setIsModalVisible(true)}>Đổi mật khẩu</button>
        </div>

        {/* Profile info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Giới thiệu</h2>
            <div className="flex items-center text-gray-600">
              <User size={20} className="mr-2" />
              {storedUser && (
                <span>Thành viên từ {calculateMembershipDuration(storedUser.info.created_at)}</span>
              )}
            </div>
          </div>

          {/* Recent activity */}
          {/* <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Hoạt động gần đây</h2>
            <p className="text-gray-600">Chưa có hoạt động gần đây</p>
          </div> */}
        </div>

        {/* Courses section */}
        {courseUserRegister.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Các khóa học đã tham gia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courseUserRegister.map(item => (
                item.course ? (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex">
                    <img
                      className="w-32 h-32 object-cover"
                      src={item.course.image_url || defaultImage}
                      alt={item.course.course_name}
                    />
                    <div className="p-6 align-middle">
                      <h3 className="font-semibold text-lg mb-2">{item.course.course_name}</h3>
                      <p className="text-gray-600 text-sm">{item.course.course_description}</p>
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Chưa có khóa học nào</h2>
          </div>
        )}
      </div>

      <Modal
        title="Đổi mật khẩu"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleChangePassword}>
          <Form.Item
            name="password_old"
            label="Mật khẩu cũ"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="recheck_password"
            label="Nhập lại mật khẩu mới"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng nhập lại mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp'))
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
