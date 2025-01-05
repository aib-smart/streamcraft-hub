import React, { useState } from 'react';
import Image from '@/components/Image';
import { Tv } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
// import ContactModal from './ContactModal';  // Assuming you have a ContactModal component

const Home = () => {
    // const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const imageUrl =
        'https://images.unsplash.com/photo-1665686377065-08ba896d16fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&h=800&q=80';

    return (
        <div className="mx-auto overflow-hidden py-0.5 md:py-4 lg:py-4 flex-grow">

            {/* Main Content Section */}
            <div className="max-w-full mx-auto px-1 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
                    {/* Left Column - Text Content */}
                    <div>
                        <h1 className="block text-[20px] font-semibold text-foreground mb-5 sm:text-lg md:text-2xl lg:text-3xl lg:leading-tight text-center md:text-left">
                            A Better Streaming 'Xperience!
                        </h1>
                        <p className="mt-1 text-[15px] md:text-lg lg:text-lg text-muted-foreground text-center md:text-left mb-8">
                            Hand-picked professional content, designed for everyone.
                        </p>

                        <div className="mt-7 gap-3 w-full flex justify-center md:justify-start mb-4">
                            {/* Get Started Button */}
                            <Link
                                to="/auth"
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-2 py-2 text-[13px] font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            >
                                Get started
                                <svg
                                    className="ml-2 size-4"
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

                            {/* Contact Us Button */}
                            {/* <button
                                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                onClick={() => setIsContactModalOpen(true)}
                            >
                                Contact Us
                            </button> */}
                        </div>
                    </div>

                    {/* Right Column - Image Section */}
                    <div className="relative w-full h-48 sm:h-64 md:h-[500px] lg:h-[600px] rounded-md overflow-hidden">
                        <Image
                            className="w-full rounded-md"
                            src={imageUrl}
                            alt="Supercharged Ladies Laughing"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 -z-[1] bg-gradient-to-tr from-gray-200 via-white/0 to-white/0 size-full rounded-md mt-4 -mb-4 me-4 -ms-4 lg:mt-6 lg:-mb-6 lg:me-6 lg:-ms-6 dark:from-neutral-800 dark:via-neutral-900/0 dark:to-neutral-900/0"></div>
                    </div>

                </div>
            </div>

            {/* Contact Modal */}
            {/* <ContactModal isOpen={isContactModalOpen} onOpenChange={setIsContactModalOpen} /> */}
        </div>
    );
};

export default Home;
