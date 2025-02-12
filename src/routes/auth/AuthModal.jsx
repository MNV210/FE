import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { LoginApi } from '../../api/LoginApi'
import { message } from 'antd'

export const AuthModal = ({ show, mode, onClose, onChangeMode, onLoginSuccess }) => {
  const [showEmailForm, setShowEmailForm] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      const response = await LoginApi.Login(data)
      console.log(response)
      // if(response.status == 200){
      // Check if the role is 'user'
        if (response.info.role == 'user') {
          // Store user data in session or local storage
          localStorage.setItem('user', JSON.stringify(response))
          sessionStorage.setItem('user', JSON.stringify(response))
          // Call onLoginSuccess to hide login/register buttons
          onLoginSuccess()
          onClose()
          message.success('Đăng nhập thành công')
          window.location.reload() // Reload the page
        } else {
          // Handle role not authorized
          // Optionally, show an error message to the user
          message.error('Tài khoản hoặc mật khẩu không đúng')
        }
      // } else {
      //   message.error('Tài khoản hoặc mật khẩu không đúng')
      // }
    } catch (error) {
      message.error('Đăng nhập thất bại')
      console.log(error)
      // Handle login error here
    }
  }

  const renderTitle = () => {
    switch (mode) {
      case 'login':
        return 'Đăng nhập '
      case 'register':
        return 'Đăng ký tài khoản F8'
      case 'forgot':
        return 'Quên mật khẩu?'
    }
  }

  const renderForm = () => {
    if (mode === 'forgot') {
      return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-center text-gray-600">
            Nhập email hoặc username của bạn và chúng tôi sẽ gửi cho bạn mã khôi phục mật khẩu.
          </p>
          <div>
            <input
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
              type="text"
              placeholder="Email hoặc Username"
              className="w-full p-2 border rounded-lg"
            />
            {errors.email && <span className="text-red-500">Trường này không được để trống và phải là email hợp lệ</span>}
          </div>
          <button 
            type="submit"
            className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Gửi mã
          </button>
        </form>
      )
    }

    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
              type="text"
              placeholder="Email hoặc số điện thoại"
              className="w-full p-2 border rounded-lg"
            />
            {errors.email && <span className="text-red-500">Trường này không được để trống và phải là email hợp lệ</span>}
          </div>
          <div>
            <input
              {...register('password', { required: true })}
              type="password"
              placeholder="Mật khẩu"
              className="w-full p-2 border rounded-lg"
            />
            {errors.password && <span className="text-red-500">Trường này không được để trống</span>}
          </div>
          <button 
            type="submit"
            className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>
      </>
    )
  }

  return (
    <Transition show={show} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="relative">
                  <button
                    onClick={onClose}
                    className="absolute right-0 top-0 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  <div className="mb-8 text-center">
                    <img src="/f8-icon.png" alt="LOGO" className="mx-auto w-16 h-16 mb-4" />
                    <Dialog.Title className="text-2xl font-bold">
                      {renderTitle()}
                    </Dialog.Title>
                  </div>

                  {renderForm()}

                  <div className="mt-6 text-center space-y-2">
                    {mode === 'login' && (
                      <>
                        <button 
                          onClick={() => onChangeMode('forgot')} 
                          className="text-gray-500 hover:text-gray-700 block w-full"
                        >
                          Quên mật khẩu?
                        </button>
                      </>
                    )}
                    {mode === 'register' && (
                      <button 
                        onClick={() => onChangeMode('login')} 
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Bạn đã có tài khoản? <span className="text-orange-500">Đăng nhập</span>
                      </button>
                    )}
                    {mode === 'forgot' && (
                      <button 
                        onClick={() => onChangeMode('login')} 
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Quay lại đăng nhập
                      </button>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
