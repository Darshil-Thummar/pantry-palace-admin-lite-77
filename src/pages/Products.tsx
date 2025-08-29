import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ProductCard from "@/components/ProductCard";
import ProductForm from "@/components/ProductForm";
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/utils/productStorage";
import { Product, ProductFormData } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const allProducts = getProducts();
    setProducts(allProducts);
  };

  const handleSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        if (editingProduct) {
          updateProduct(editingProduct.id, data);
          toast({
            title: "Product Updated",
            description: "Product has been successfully updated.",
          });
        } else {
          addProduct(data);
          toast({
            title: "Product Added",
            description: "New product has been successfully added.",
          });
        }
        
        loadProducts();
        setShowForm(false);
        setEditingProduct(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleDelete = async (product: Product) => {
    try {
      deleteProduct(product.id);
      toast({
        title: "Product Deleted",
        description: `${product.name} has been removed.`,
      });
      loadProducts();
      setDeletingProduct(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
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

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">Manage your product inventory</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={openAddForm} className="pantry-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
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
                ${products.length > 0 
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
              <div key={product.id} className="relative group">
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