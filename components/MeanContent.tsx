import React from "react";
import Link from "next/link";
import Image from "next/image";

const MeanContent: React.FC = () => {
  return (
    <section className="flex  items-center bg-gray-100">
      <title>Home</title>

      <div className=" w-1/2 mx-36">
        <div className="mr-auto place-self-center">
          <p className="text-2xl font-semibold font-sans mb-8  text-teal-500">
            Less Hassle, More Care
          </p>
          <h1 className="sm:text-6xl text-3xl max-w-2xl font-sans font-bold  ">
            The future of Care Records Management
          </h1>
          <p className="text-lg text-teal-800 font-medium mt-12 w-96">
            Your one-stop solution to manage all your homes, from task
            management to daily logs.
          </p>
        </div>
        <div className="mt-10">
          {/* <span className="text-sm font-medium">Sign In Now</span> */}
          <Link
            href="/api/auth/login"
            className="bg-teal-300 border-0 hover:transition   py-2  px-8 focus:outline-none font-medium hover:bg-teal-500 rounded text-base mt-4 md:mt-0"
          >
            Sign in
          </Link>
        </div>
      </div>
      <div className="img-float ">
        <picture>
          <source srcSet="https://home.lief.care/wp-content/uploads/2023/05/h1-img.webp 970w, https://home.lief.care/wp-content/uploads/2023/05/h1-img-300x195.webp 300w, https://home.lief.care/wp-content/uploads/2023/05/h1-img-768x500.webp 768w" />
          <Image
            decoding="async"
            priority
            src="https://home.lief.care/wp-content/uploads/2023/05/h1-img.webp"
            width={970}
            height={631}
            className=""
            alt=""
            sizes="(max-width: 970px) 100vw, 970px"
          />
        </picture>
        <picture>
          <source srcSet="https://home.lief.care/wp-content/uploads/2023/05/h2-img.webp 756w, https://home.lief.care/wp-content/uploads/2023/05/h2-img-300x194.webp 300w" />
          <Image
            decoding="async"
            width={400}
            height={488}
            src="https://home.lief.care/wp-content/uploads/2023/05/h2-img.webp"
            className=""
            alt=""
          />
        </picture>
      </div>
    </section>
  );
};

export default MeanContent;
