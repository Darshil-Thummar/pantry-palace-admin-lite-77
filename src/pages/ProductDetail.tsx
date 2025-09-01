import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Plus, Minus, ShoppingCart, Loader2 } from "lucide-react";
import { productService, Product } from "@/services/productService";
import { toast } from "@/components/ui/sonner";
import { API_CONFIG } from "@/config/api";
import { useRequireAuth } from "@/hooks/useAuthRedirect";
import { useCart } from "@/contexts/CartContext";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const { addItem, getItemQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const productData = await productService.getProductById(id);
      setProduct(productData);
    } catch (error: any) {
      console.error('Error loading product:', error);
      setError(error.message || "Failed to load product");
      toast.error("Failed to load product details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (product) {
      navigate(`/products?edit=${product._id}`);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      await productService.deleteProduct(product._id);
      toast.success(`${product.name} has been deleted successfully`);
      navigate('/products');
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || "Failed to delete product");
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setIsAddingToCart(true);
      await addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      }, quantity);
      
      toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart!`);
    } catch (error) {
      toast.error(`Failed to add ${product.name} to cart`);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Checking Authentication...</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Please wait while we verify your login status.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <CardTitle className="text-red-600">Product Not Found</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {error || "The product you're looking for doesn't exist or has been removed."}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => navigate('/products')} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Products
                  </Button>
                  <Button onClick={loadProduct} className="pantry-gradient">
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/products')}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <Card className="card-gradient">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-3xl">{product.name}</CardTitle>
                    <Badge variant="secondary" className="w-fit">
                      {capitalizeFirstLetter(product.category)}
                    </Badge>
                  </div>
                  {isAuthenticated ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleEdit}
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={handleDelete}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => navigate('/login')}
                      variant="outline"
                      size="sm"
                    >
                      Login to Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Price</h3>
                  <div className="text-4xl font-bold text-primary">
                    ₹{product.price.toFixed(2)}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <p className="text-base leading-relaxed">{product.description}</p>
                </div>

                {/* Category */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                  <p className="text-base">{capitalizeFirstLetter(product.category)}</p>
                </div>

                {/* Add to Cart Section */}
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Quantity</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="w-10 h-10 p-0"
                        disabled={isAddingToCart}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-16 text-center text-lg font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="w-10 h-10 p-0"
                        disabled={isAddingToCart}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-lg font-medium text-muted-foreground">
                      Total: ₹{(product.price * quantity).toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={handleAddToCart}
                      className="flex-1 pantry-gradient"
                      size="lg"
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => navigate('/cart')}
                      variant="outline"
                      size="lg"
                    >
                      View Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;