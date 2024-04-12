import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col text-gtGold bg-mainTheme items-center justify-center min-h-screen w-screen'>
        <div className="flex flex-col w-3/6 self-center my-32">
        <h1 className="text-2xl font-semibold mx-6 mt-4">Privacy Policy</h1>
        <p className="text-xs mx-6 italic">Effective date: April 9, 2024</p>
        <p className="mx-6 mt-4">
          We respect your privacy and are committed to protecting your personal
          information.
        </p>
        <p className="mx-6">
          This Privacy Policy outlines our practices regarding the collection,
          use, and disclosure of your information when you use our website.
        </p>
        <hr className="w-full my-10 rounded-lg" />
        <h2 className="text-xl mx-6 font-semibold">Information We Collect</h2>
        <h3 className="text-lg mx-6 mt-4 font-semibold">
          Information You Provide
        </h3>
        <p className="mx-6">
          We collect the information you provide, such as your name
          and contact information, when you sign up.
        </p>
        <h3 className="text-lg mx-6 mt-4 font-semibold">
          Information We Collect Automatically
        </h3>
        <p className="mx-6">
          Like many websites, we collect information automatically. This
          includes what pages you visited, your operating system, and
          your type of internet browser.
        </p>
        <hr className="w-full my-10 rounded-lg" />
        <h2 className="text-xl mx-6 font-semibold">
          How We Use Your Information
        </h2>
        <h3 className="text-lg mx-6 mt-4 font-semibold">
          Improving GT Lost and Found
        </h3>
        <p className="mx-6">
          We use aggregated, non-identifiable information to improve our website.
        </p>
        <hr className="w-full my-10 rounded-lg" />
        <h2 className="text-xl mx-6 font-semibold">
          How We Share Your Information
        </h2>
        <h3 className="text-lg mx-6 mt-4 font-semibold">
          Third-Party Service Providers
        </h3>
        <p className="mx-6">
          We do not share your information with third parties.
        </p>
        <h3 className="text-lg mx-6 mt-4 font-semibold">No Hidden Policies</h3>
        <p className="mx-6">
          GT Lost and Found does not and will not sell your information to third parties.
        </p>
        <hr className="w-full my-10 rounded-lg" />
        <h2 className="text-xl mx-6 font-semibold">Security</h2>
        <h3 className="text-lg mx-6 mt-4 font-semibold">
          Protecting Your Information
        </h3>
        <p className="mx-6">
          We take the necessary precautions to protect your information. We
          encrypt sensitive information transmitted online.
        </p>
        <hr className="w-full my-10 rounded-lg" />
        <h2 className="text-xl mx-6 font-semibold">
          Changes to This Privacy Policy
        </h2>
        <h3 className="text-lg mx-6 mt-4 font-semibold">
          Updating the Privacy Policy
        </h3>
        <p className="mx-6">
          GT Lost and Found may update this policy at any time.
          Policy changes will be posted on this page.
        </p>
        <h3 className="text-lg mx-6 mt-4 font-semibold">Contact Information</h3>
        <p className="mx-6">{`If you have any questions about this Privacy Policy, please contact us at ${process.env.BUSINESS_EMAIL}`}</p>
      </div>
    </div>
  )
}

export default page