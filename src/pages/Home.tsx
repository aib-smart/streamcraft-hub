import React, { useState } from "react";
import Image from "@/components/Image";
import { Tv } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Home = () => {
  const imageUrl =
    "https://images.unsplash.com/photo-1665686377065-08ba896d16fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&h=800&q=80";

  return (
    <div className="py-6 flex-grow">
      {/* Main Content Section */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 xl:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h1 className="text-[22px] sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-5 text-center md:text-left">
              A Better Streaming 'Xperience!
            </h1>
            <p className="mt-1 text-[15px] md:text-lg lg:text-xl text-muted-foreground text-center md:text-left mb-6">
              Hand-picked professional content, designed for everyone.
            </p>

            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
              {/* Get Started Button */}
              <Link
                to="/auth"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Get Started
                <svg
                  className="ml-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>

              {/* Contact Us Button (if enabled in the future) */}
              {/* <button
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => setIsContactModalOpen(true)}
              >
                Contact Us
              </button> */}
            </div>
          </div>

          {/* Right Column - Image Section */}
          <div className="relative w-full h-64 md:h-80 lg:h-[500px] rounded-md overflow-hidden">
            <Image
              className="w-full h-full object-cover rounded-md"
              src={imageUrl}
              alt="Supercharged Ladies Laughing"
              loading="lazy"
            />
            <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 dark:from-neutral-800 dark:via-neutral-900/0 dark:to-neutral-900/0"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
