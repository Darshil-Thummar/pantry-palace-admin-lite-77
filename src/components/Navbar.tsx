import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const { state: cart } = useCart();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 pantry-gradient rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">
              Pantry Palace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className="font-medium"
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            {/* Cart Icon */}
            <Link to="/cart" className="relative ml-4">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cart.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cart.items.length}
                  </span>
                )}
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/products">
                  <Button className="ml-2 pantry-gradient">
                    Products
                  </Button>
                </Link>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="ml-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="ml-2 pantry-gradient">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t bg-card">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    className="w-full justify-start font-medium"
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
              
              {/* Cart Link for Mobile */}
              <Link to="/cart" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full justify-start relative">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                  {cart.items.length > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cart.items.length}
                    </span>
                  )}
                </Button>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/products" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-start pantry-gradient mt-2">
                      Products
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full justify-start mt-2"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-start pantry-gradient mt-2">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;