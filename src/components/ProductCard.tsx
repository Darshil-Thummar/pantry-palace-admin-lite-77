import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-medium transition-shadow duration-300 card-gradient">
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
            {product.category}
          </Badge>
        </div>
        <div className="text-2xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="line-clamp-3">
          {product.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ProductCard;