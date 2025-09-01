import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ProductCard from "@/components/ProductCard";
import ProductForm from "@/components/ProductForm";
import { productService, Product, ProductFormData } from "@/services/productService";
import { useRequireAuth } from "@/hooks/useAuthRedirect";
import { toast } from "@/components/ui/sonner";
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check authentication and redirect if needed
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Check if there's an edit parameter in the URL
    const editId = searchParams.get('edit');
    if (editId && products.length > 0) {
      const productToEdit = products.find(p => p._id === editId);
      if (productToEdit) {
        setEditingProduct(productToEdit);
        setShowForm(true);
        // Remove the edit parameter from URL
        setSearchParams({});
      }
    }
  }, [searchParams, products, setSearchParams]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const allProducts = await productService.getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, data);
        toast.success("Product has been successfully updated.");
      } else {
        await productService.createProduct(data);
        toast.success("New product has been successfully added.");
      }
      
      await loadProducts();
      setShowForm(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      await productService.deleteProduct(product._id);
      toast.success(`${product.name} has been removed.`);
      await loadProducts();
      setDeletingProduct(null);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || "Failed to delete product.");
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const openAddForm = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // Show loading state while checking authentication
  if (authLoading) {
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

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">Manage your product inventory</p>
          </div>
          <Button onClick={openAddForm} className="pantry-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-gradient">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardHeader>
          </Card>
          <Card className="card-gradient">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
              <div className="text-2xl font-bold">
                {new Set(products.map(p => p.category)).size}
              </div>
            </CardHeader>
          </Card>
          <Card className="card-gradient">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Price
              </CardTitle>
              <div className="text-2xl font-bold">
                ₹{products.length > 0 
                  ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)
                  : '0.00'
                }
              </div>
            </CardHeader>
          </Card>
          <Card className="card-gradient">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Latest Added
              </CardTitle>
              <div className="text-2xl font-bold">
                {products.length > 0 ? 'Today' : 'None'}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="relative group">
                <ProductCard product={product} />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openEditForm(product)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeletingProduct(product)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="card-gradient text-center py-16">
            <CardHeader>
              <CardTitle className="text-2xl">No Products Yet</CardTitle>
              <CardDescription className="text-lg">
                Start by adding your first product to the inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={openAddForm} className="pantry-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Product Form Dialog */}
        <Dialog open={showForm} onOpenChange={closeForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct || undefined}
              onSubmit={handleSubmit}
              onCancel={closeForm}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog 
          open={!!deletingProduct} 
          onOpenChange={() => setDeletingProduct(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletingProduct?.name}"? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingProduct && handleDelete(deletingProduct)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Products;