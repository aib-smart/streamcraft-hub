import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About JStreams</h3>
            <p className="text-muted-foreground">
              Hand-picked professional content, designed for everyone.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 uppercase">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/streams" className="text-muted-foreground hover:text-primary">
                  Browse Streams
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground hover:text-primary">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary uppercase">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 uppercase">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X(Twitter)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground text-[12px]">
          <p>&copy; {new Date().getFullYear()} JStreamz Media. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;