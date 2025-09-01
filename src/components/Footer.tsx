import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">Pantry Palace</h3>
            <p className="text-muted-foreground text-sm">
              Your premium destination for fresh, quality groceries delivered with care.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Admin</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Register
                </Link>
              </li>
              <li>
                <button className="text-muted-foreground hover:text-primary transition-colors text-sm text-left">
                  Products
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Info</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: info@pantrypalace.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 123 Grocery St, Food City</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Pantry Palace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;