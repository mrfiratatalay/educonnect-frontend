import { useState, useRef } from "react";
import { Upload, Camera, X, Search, Loader2, Sparkles, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/data/mock";
import type { Product } from "@/types";

interface SearchResult {
  product: Product;
  score: number;
}

const conditionLabel: Record<string, string> = {
  new: "Sıfır",
  "like-new": "Yeni Gibi",
  good: "İyi",
  fair: "Orta",
};

export default function VisualSearchPage() {
  const [image, setImage] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResults([]);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const handleSearch = async () => {
    if (!image) return;
    setSearching(true);
    await new Promise((r) => setTimeout(r, 2000));
    const mockResults: SearchResult[] = mockProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .map((product, i) => ({
        product,
        score: Math.round((95 - i * 8 - Math.random() * 5) * 10) / 10,
      }));
    setResults(mockResults);
    setSearching(false);
  };

  const clearImage = () => {
    setImage(null);
    setResults([]);
  };

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          Görsel Arama
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Bir fotoğraf yükle, yapay zeka ile benzer ürünleri anında bul.
        </p>
      </div>

      {!image ? (
        <Card
          className="border-2 border-dashed hover:border-primary/50 transition-colors cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-1">
              Görselinizi yükleyin
            </h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm leading-relaxed">
              Sürükle bırak yapın veya tıklayarak dosya seçin. PNG, JPG, WEBP
              formatları desteklenir.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Dosya Seç
              </Button>
              <Button variant="outline" className="gap-2">
                <Camera className="w-4 h-4" />
                Kamera
              </Button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="relative group w-full sm:w-64 shrink-0">
                <img
                  src={image}
                  alt="Yüklenen görsel"
                  className="w-full aspect-square object-cover rounded-xl border"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Görsel yüklendi</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Yapay zeka modeli bu görseli analiz edecek ve veritabanındaki
                  benzer ürünleri bulacak.
                </p>
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={handleSearch}
                    disabled={searching}
                    className="gap-2"
                  >
                    {searching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    {searching ? "Aranıyor..." : "Benzer Ürünleri Bul"}
                  </Button>
                  <Button variant="outline" onClick={clearImage}>
                    Farklı Görsel
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Benzer Ürünler</h2>
            <Badge variant="secondary">{results.length} sonuç</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.map(({ product, score }) => (
              <Card
                key={product.id}
                className="overflow-hidden group hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="relative bg-secondary/30">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-2 right-2 bg-primary/90 text-[11px]">
                    %{score} eşleşme
                  </Badge>
                </div>
                <CardContent className="p-3 space-y-2">
                  <h3 className="font-medium text-sm line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">
                      {product.price} TL
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {conditionLabel[product.condition]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {product.sellerName}
                  </p>
                  <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Satıcıyla İletişim
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
