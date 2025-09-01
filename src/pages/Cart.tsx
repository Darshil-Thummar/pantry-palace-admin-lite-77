import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingCart, RefreshCw } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useRequireAuth } from "@/hooks/useAuthRedirect";
import { toast } from "@/components/ui/sonner";

const Cart = () => {
  const navigate = useNavigate();
  const { state: cart, removeItem, updateQuantity, clearCart, fetchCart } = useCart();
  const { isAuthenticated, isLoading } = useRequireAuth();
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, number>>({});

  // Debug logging
  useEffect(() => {
    console.log('Cart page - Cart state:', cart);
    console.log('Cart page - Items count:', cart.items.length);
    console.log('Cart page - Loading:', cart.loading);
    console.log('Cart page - Error:', cart.error);
  }, [cart]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
                </div>
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

  // If not authenticated, this will redirect to login automatically
  // The useRequireAuth hook handles the redirect

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // If quantity goes below 1, remove item immediately
      removeItem(itemId);
    } else {
      // Store the pending update - user can change multiple times
      setPendingUpdates(prev => ({
        ...prev,
        [itemId]: newQuantity
      }));
    }
  };

  const handleDirectQuantityInput = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // If quantity goes below 1, remove item immediately
      removeItem(itemId);
    } else {
      // Store the pending update - user can set exact quantity
      setPendingUpdates(prev => ({
        ...prev,
        [itemId]: newQuantity
      }));
    }
  };

  const handleUpdateQuantity = async (itemId: string) => {
    const newQuantity = pendingUpdates[itemId];
    if (newQuantity && newQuantity !== cart.items.find(item => item._id === itemId)?.quantity) {
      await updateQuantity(itemId, newQuantity);
      // Clear the pending update after successful API call
      setPendingUpdates(prev => {
        const newPending = { ...prev };
        delete newPending[itemId];
        return newPending;
      });
    }
  };

  const handleRefreshCart = async () => {
    console.log('Cart page - Refreshing cart...');
    await fetchCart();
  };

  // Show loading state
  if (cart.loading && cart.items.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
                </div>
                <CardTitle className="text-2xl">Loading Cart...</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Please wait while we fetch your cart items.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (cart.error && cart.items.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-destructive" />
                </div>
                <CardTitle className="text-2xl text-destructive">Error Loading Cart</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {cart.error}
                </p>
                <Button onClick={handleRefreshCart} className="pantry-gradient">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl">Your Cart is Empty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Button onClick={() => navigate('/gallery')} className="pantry-gradient">
                  Start Shopping
                </Button>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground mt-2">
              {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefreshCart}
              variant="outline"
              disabled={cart.loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${cart.loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => navigate('/gallery')}
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </div>

        {/* Error Banner */}
        {cart.error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-destructive">{cart.error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshCart}
                className="text-destructive hover:text-destructive"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.length > 0 ? (
              cart.items.map((item) => (
                <Card key={item._id} className="card-gradient">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </Badge>
                        <div className="text-lg font-bold text-primary mt-2">
                          ₹{item.price.toFixed(2)}
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item._id, (pendingUpdates[item._id] || item.quantity) - 1)}
                          className="w-8 h-8 p-0"
                          disabled={cart.loading}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <input
                          type="number"
                          min="1"
                          value={pendingUpdates[item._id] !== undefined ? pendingUpdates[item._id] : item.quantity}
                          onChange={(e) => handleDirectQuantityInput(item._id, parseInt(e.target.value) || 1)}
                          className="w-16 text-center border rounded px-2 py-1 text-sm"
                          disabled={cart.loading}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item._id, (pendingUpdates[item._id] || item.quantity) + 1)}
                          className="w-8 h-8 p-0"
                          disabled={cart.loading}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        {pendingUpdates[item._id] !== undefined && pendingUpdates[item._id] !== item.quantity && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item._id)}
                            disabled={cart.loading}
                            className="text-xs px-2 py-1"
                          >
                            Update
                          </Button>
                        )}
                      </div>
                      
                      {/* Total Price */}
                      <div className="text-right min-w-[80px]">
                        <div className="text-lg font-bold text-primary">
                          ₹{((pendingUpdates[item._id] !== undefined ? pendingUpdates[item._id] : item.quantity) * item.price).toFixed(2)}
                        </div>
                        {pendingUpdates[item._id] !== undefined && pendingUpdates[item._id] !== item.quantity && (
                          <div className="text-xs text-muted-foreground line-through">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        )}
                      </div>
                      
                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item._id)}
                        className="text-destructive hover:text-destructive"
                        disabled={cart.loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="card-gradient">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No items in cart</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="card-gradient sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cart.total.toFixed(2)}</span>
                </div>
                
                {/* Shipping */}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{cart.total.toFixed(2)}</span>
                  </div>
                  {Object.keys(pendingUpdates).length > 0 && (
                    <div className="text-xs text-muted-foreground text-center mt-2">
                      * Total will update after applying changes
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 