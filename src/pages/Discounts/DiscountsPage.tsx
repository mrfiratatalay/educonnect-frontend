import { useState } from "react";
import { Tag, Copy, Check, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockDiscounts } from "@/data/mock";

export default function DiscountsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (id: string, code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const daysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">İndirimler</h1>
        <p className="text-muted-foreground mt-1">
          Yerel işletmelerin EduConnect öğrencilerine özel kampanyaları
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockDiscounts.map((discount) => (
          <Card key={discount.id} className="overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-bl-[3rem]" />
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Tag className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{discount.businessName}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Clock className="w-3 h-3" />
                      {daysLeft(discount.validUntil)} gün kaldı
                    </div>
                  </div>
                </div>
                <Badge variant="accent" className="text-base font-bold px-3">
                  %{discount.discountRate}
                </Badge>
              </div>

              <div>
                <p className="font-medium text-sm">{discount.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {discount.description}
                </p>
              </div>

              {discount.code && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 rounded-lg bg-secondary/70 border border-dashed font-mono text-sm text-center tracking-wider">
                    {discount.code}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyCode(discount.id, discount.code)}
                    className="shrink-0"
                  >
                    {copiedId === discount.id ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
