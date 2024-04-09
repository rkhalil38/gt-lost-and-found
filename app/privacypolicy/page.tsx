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
          We collect the information you voluntarily provide, such as your name
          and contact information, when you sign up.
        </p>
        <h3 className="text-lg mx-6 mt-4 font-semibold">
          Information We Collect Automatically
        </h3>
        <p className="mx-6">
          Like many websites, we collect some information automatically. This
          includes what features you interacted with, your operating system, and
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
          We may use aggregated, non-identifiable information for analytical
          purposes to improve our website and services.
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
          We do not and will not sell your information. All policies are
          outlined in this Privacy Policy.
        </p>
        <hr className="w-full my-10 rounded-lg" />
        <h2 className="text-xl mx-6 font-semibold">Security</h2>
        <h3 className="text-lg mx-6 mt-4 font-semibold">
          Protecting Your Information
        </h3>
        <p className="mx-6">
          We take reasonable precautions to protect your information. However,
          please be aware no method of transmission over the internet is
          completely secure.
        </p>
        <hr className="w-full my-10 rounded-lg" />
        <h2 className="text-xl mx-6 font-semibold">
          Changes to This Privacy Policy
        </h2>
        <h3 className="text-lg mx-6 mt-4 font-semibold">
          Updating the Privacy Policy
        </h3>
        <p className="mx-6">
          We reserve the right to update this Privacy Policy at any time.
          Changes will be effective immediately upon posting on the website.
        </p>
        <h3 className="text-lg mx-6 mt-4 font-semibold">Contact Information</h3>
        <p className="mx-6">{`If you have any questions about this Privacy Policy, please contact us at ${process.env.BUSINESS_EMAIL}`}</p>
      </div>
    </div>
  )
}

export default page