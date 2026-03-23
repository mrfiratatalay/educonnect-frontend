import { useState } from "react";
import { Search, Plus, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { mockProducts } from "@/data/mock";
import type { Product } from "@/types";

const categories = [
  "Tümü",
  "Kitap",
  "Elektronik",
  "Ev & Yaşam",
  "Kırtasiye",
  "Diğer",
];
const conditionLabel: Record<string, string> = {
  new: "Sıfır",
  "like-new": "Yeni Gibi",
  good: "İyi",
  fair: "Orta",
};
const conditionColor: Record<
  string,
  "success" | "default" | "secondary" | "outline"
> = {
  new: "success",
  "like-new": "default",
  good: "secondary",
  fair: "outline",
};

export default function MarketplacePage() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("Kitap");

  const handleCreateProduct = () => {
    if (!newTitle.trim() || !newPrice.trim()) return;
    const product: Product = {
      id: `pr-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || "Açıklama eklenmedi.",
      price: parseInt(newPrice, 10) || 0,
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      category: newCategory,
      sellerName: user?.fullName || "Kullanıcı",
      sellerAvatar: user?.avatarUrl,
      condition: "good",
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setProducts([product, ...products]);
    setNewTitle("");
    setNewDesc("");
    setNewPrice("");
    setNewCategory("Kitap");
    setDialogOpen(false);
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "Tümü" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Pazar
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            İkinci el ürünler, ders kitapları ve daha fazlası
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 self-start shadow-sm">
              <Plus className="w-4 h-4" />
              İlan Ver
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni İlan Oluştur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Başlık</Label>
                <Input
                  placeholder="Ürün adı"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <textarea
                  placeholder="Ürün hakkında detaylar..."
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Fiyat (TL)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {categories
                      .filter((c) => c !== "Tümü")
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Fotoğraf</Label>
                <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-xl text-muted-foreground text-sm cursor-pointer hover:border-primary/50 transition-colors">
                  Fotoğraf yüklemek için tıklayın
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handleCreateProduct}
                disabled={!newTitle.trim() || !newPrice.trim()}
              >
                İlanı Yayınla
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ürün ara..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="shrink-0"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
        {filtered.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden group cursor-pointer hover:shadow-md"
          >
            <div className="relative overflow-hidden bg-secondary/30">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge
                variant={conditionColor[product.condition]}
                className="absolute top-2 left-2 text-[10px]"
              >
                {conditionLabel[product.condition]}
              </Badge>
            </div>
            <CardContent className="p-3 space-y-2">
              <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem] leading-snug">
                {product.title}
              </h3>
              <p className="text-lg font-bold text-primary">{product.price} TL</p>
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={product.sellerAvatar} />
                  <AvatarFallback className="text-[8px]">
                    {product.sellerName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[11px] text-muted-foreground truncate">
                  {product.sellerName}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Sonuç bulunamadı</p>
          <p className="text-sm mt-1">
            Farklı anahtar kelimeler veya kategori deneyin.
          </p>
        </div>
      )}
    </div>
  );
}
