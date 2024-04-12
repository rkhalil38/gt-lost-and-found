import React from "react";

const page = () => {
  return (
    <div className="flex flex-col text-gtGold bg-mainTheme items-center justify-center min-h-screen w-screen">
      <div className="flex flex-col gap-4 w-3/6 self-center py-32">
        <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        <p className="text-xs  italic">Effective date: April 9, 2024</p>
        <p className=" ">
          We respect your privacy and are committed to protecting your personal
          information.
        </p>
        <p className="">
          This Privacy Policy outlines our practices regarding the collection,
          use, and disclosure of your information when you use our website.
        </p>
        <hr className="w-full rounded-lg" />
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Information We Collect</h2>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Information You Provide</h3>
            <p className="">
              We collect the information you provide, such as your name and contact
              information, when you sign up.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">
              Information We Collect Automatically
            </h3>
            <p className="">
              Like many websites, we collect information automatically. This
              includes what pages you visited, your operating system, and your type
              of internet browser.
            </p>
          </div>
        </div>
        <hr className="w-full rounded-lg" />
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">How We Use Your Information</h2>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Improving GT Lost and Found</h3>
            <p className="">
              We use aggregated, non-identifiable information to improve our
              website.
            </p>
          </div>
        </div>
        <hr className="w-full rounded-lg" />
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">
            How We Share Your Information
          </h2>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">
              Third-Party Service Providers
            </h3>
            <p className="">We do not share your information with third parties.</p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">No Hidden Policies</h3>
            <p className="">
              GT Lost and Found does not and will not sell your information to third
              parties.
            </p>
          </div>
        </div>
        <hr className="w-full rounded-lg" />
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Security</h2>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Protecting Your Information</h3>
            <p className="">
              We take the necessary precautions to protect your information. We
              encrypt sensitive information transmitted online.
            </p>
          </div>
        </div>
        <hr className="w-full rounded-lg" />
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">
            Changes to This Privacy Policy
          </h2>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Updating the Privacy Policy</h3>
            <p className="">
              GT Lost and Found may update this policy at any time. Policy changes
              will be posted on this page.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <p className="">{`If you have any questions about this Privacy Policy, please contact us at ${process.env.BUSINESS_EMAIL}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
