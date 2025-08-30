import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { useState, useEffect } from "react";
import { Product } from "@/services/productService";
import { productService } from "@/services/productService";
import { Link } from "react-router-dom";
import { Leaf, Shield, Truck, Heart, Plus } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Load featured products (first 6)
    const loadFeaturedProducts = async () => {
      try {
        const allProducts = await productService.getAllProducts();
        setProducts(allProducts.slice(0, 6));
      } catch (error) {
        console.error('Error loading featured products:', error);
      }
    };
    loadFeaturedProducts();
  }, []);

  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-primary" />,
      title: "Fresh & Organic",
      description: "Locally sourced, organic produce delivered fresh to your door"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Quality Guaranteed",
      description: "100% satisfaction guarantee on all our premium products"
    },
    {
      icon: <Truck className="w-8 h-8 text-primary" />,
      title: "Fast Delivery",
      description: "Same-day delivery available for orders placed before 2 PM"
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Community First",
      description: "Supporting local farmers and sustainable farming practices"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Pantry Palace
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Your premium destination for fresh, quality groceries
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/gallery">
              <Button size="lg" className="pantry-gradient text-lg px-8">
                Explore Products
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white/30 text-white hover:bg-white/20">
                Learn More
              </Button>
            </Link>
            {isAuthenticated && (
              <Link to="/products">
                <Button size="lg" className="pantry-gradient text-lg px-8">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Pantry Palace?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to bringing you the freshest, highest quality groceries with exceptional service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-shadow card-gradient">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 hero-gradient">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium groceries
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                         {products.map((product) => (
               <ProductCard key={product._id} product={product} />
             ))}
          </div>
          <div className="text-center">
            <Link to="/gallery">
              <Button size="lg" className="pantry-gradient">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
