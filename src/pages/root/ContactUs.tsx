
import { IoLocationOutline, IoMailOutline } from 'react-icons/io5'
import { LuPhoneCall } from 'react-icons/lu'
import Button from '../../components/layout/buttons/Button'
import Input from '../../components/layout/inputs/Input'
import { BsTelephone } from 'react-icons/bs'
import { MdOutlineAlternateEmail } from 'react-icons/md'
import { FiUser } from 'react-icons/fi'
import FormError from '../../components/layout/FormError'
import FormSuccess from '../../components/layout/FormSuccess'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from "zod";
import { axiosInstance } from '../../config/api'
import { ContactFormSchema } from '../../schemas'

const ContactUs = () => {
  return (
    <div className="container py-4 my-8">
      <div className="flex md:flex-row flex-col gap-8">
        <div className="md:w-1/2 w-full">
          <h1 className="text-2xl font-semibold">
            We would love to hear from you !
          </h1>
          <p className="my-2 text-gray-700">
            Complete the folowwing form and we will be in touch with you within
            4-5 business days.
          </p>

          <div className="my-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 group">
                <IoLocationOutline
                  size={24}
                  className="group-hover:text-primary transition"
                />
              </div>
              <p className="text-gray-500">
                1 Beverly Hills, House 36, Los Angeles, California, United
                States.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 group">
                <LuPhoneCall
                  size={24}
                  className="group-hover:text-primary transition"
                />
              </div>
              <p className="text-gray-500">+91 79840 35721</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 group">
                <IoMailOutline
                  size={24}
                  className="group-hover:text-primary transition"
                />
              </div>
              <p className="text-gray-500">contact@test.com</p>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 w-full">
          <ContactForm />
        </div>
      </div>

    </div>
  )
}

export default ContactUs
type Schema = z.infer<typeof ContactFormSchema>;
const ContactForm = () => {

  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  setValue
  } = useForm<Schema>({
    resolver: zodResolver(ContactFormSchema),
  });



  const onSubmit = async (data: Schema) => {
   
    setValue("name", "")
    setValue("email", "")
    setValue("phone", "")
    setValue("message", "")
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    }
  }, [success]);

  return (
    <>
     
      <form
        className={`flex flex-col gap-4`}
      >
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <Input
            id="name"
            register={register}
            error={errors.name?.message}
            placeholder="John Doe"
            icon={FiUser}
            label="Name"
          />

          <Input
            id="email"
            register={register}
            error={errors.email?.message}
            placeholder="joh@doe.email.com"
            icon={MdOutlineAlternateEmail}
            label="Email"
          />
        </div>
        <Input
          id="phone"
          register={register}
          placeholder="+1 888234765"
          icon={BsTelephone}
          label="Phone"
          error={errors.phone?.message}
        />

        <div>
          <label
            htmlFor="description"
            className="text-xs font-medium text-gray-900"
          >
            Description
          </label>
          <textarea
            rows={8}
            {...register("message")}
            className="w-full border border-gray-300 rounded p-2 outline-none text-sm text-gray-800"
          ></textarea>
          {errors.message?.message && (
            <p className="text-xs text-red-500 ">{errors.message.message}</p>
          )}
        </div>

        <div className="w-[100px]">
          <Button
            // disabled={isPending}
            // loading={isPending}
            label="Submit"
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </form>
    </>
  );
};