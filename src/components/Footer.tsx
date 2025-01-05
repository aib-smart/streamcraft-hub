import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  // Check if we're on the Auth & Home page
  const isAuthPage = location.pathname === "/auth";
  const isHomePage = location.pathname === "/";
  const isContactPage = location.pathname === "/contact";

  return (
    <footer className="bg-background text-muted-foreground border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-primary">About Us</h3>
            <p className="text-[14px] sm:text-base leading-relaxed">
              Hand-picked professional content, designed for everyone. Enjoy high-quality streams tailored to your preferences.
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-4">
              {/* Conditionally render the links */}
              {!isAuthPage && !isHomePage && !isContactPage && (
                <>
                  <li>
                    <Link
                      to="/streams"
                      className="text-muted-foreground hover:text-primary text-[14px] sm:text-base"
                    >
                      Browse Streams
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="text-muted-foreground hover:text-primary text-[14px] sm:text-base"
                    >
                      My Profile
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary text-[14px] sm:text-base"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4 text-primary">Connect</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary text-[14px] sm:text-base"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X(Twitter)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary text-[14px] sm:text-base"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-muted-foreground text-[12px] sm:text-[14px]">
          <p>&copy; {new Date().getFullYear()} JStreamz Media. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
