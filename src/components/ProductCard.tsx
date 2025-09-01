import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/services/productService";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Eye, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ProductCardProps {
  product: Product;
}

// Helper function to capitalize first letter for display
const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    
    try {
      setIsAddingToCart(true);
      await addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(`Failed to add ${product.name} to cart`);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-medium transition-shadow duration-300 card-gradient cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
          <Badge variant="secondary" className="ml-2 shrink-0">
            {capitalizeFirstLetter(product.category)}
          </Badge>
        </div>
        <div className="text-2xl font-bold text-primary">
          ₹{product.price.toFixed(2)}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="line-clamp-3 mb-4">
          {product.description}
        </CardDescription>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="flex-1 pantry-gradient"
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
          <Button
            onClick={handleCardClick}
            variant="outline"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;