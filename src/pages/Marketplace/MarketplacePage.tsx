import { useState } from "react";
import { Search, Plus } from "lucide-react";
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
import { mockProducts } from "@/data/mock";

const categories = ["Tümü", "Kitap", "Elektronik", "Ev & Yaşam", "Kırtasiye", "Diğer"];
const conditionLabel: Record<string, string> = {
  new: "Sıfır",
  "like-new": "Yeni Gibi",
  good: "İyi",
  fair: "Orta",
};
const conditionColor: Record<string, "success" | "default" | "secondary" | "outline"> = {
  new: "success",
  "like-new": "default",
  good: "secondary",
  fair: "outline",
};

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const filtered = mockProducts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "Tümü" || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Pazar</h1>
          <p className="text-muted-foreground mt-1">
            İkinci el ürünler, ders kitapları ve daha fazlası
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 self-start">
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
                <Input placeholder="Ürün adı" />
              </div>
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <textarea
                  placeholder="Ürün hakkında detaylar..."
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Fiyat (TL)</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {categories.filter((c) => c !== "Tümü").map((c) => (
                      <option key={c} value={c}>{c}</option>
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
              <Button className="w-full">İlanı Yayınla</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <Card key={product.id} className="overflow-hidden group cursor-pointer">
            <div className="relative overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge
                variant={conditionColor[product.condition]}
                className="absolute top-2 left-2"
              >
                {conditionLabel[product.condition]}
              </Badge>
            </div>
            <CardContent className="p-3 space-y-2">
              <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">
                {product.title}
              </h3>
              <p className="text-lg font-bold text-primary">{product.price} TL</p>
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={product.sellerAvatar} />
                  <AvatarFallback className="text-[8px]">{product.sellerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate">{product.sellerName}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">Sonuç bulunamadı</p>
          <p className="text-sm mt-1">Farklı anahtar kelimeler veya kategori deneyin.</p>
        </div>
      )}
    </div>
  );
}
