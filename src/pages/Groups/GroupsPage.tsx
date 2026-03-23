import { useState } from "react";
import { Users, Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mockGroups } from "@/data/mock";
import { useAuthStore } from "@/store/authStore";
import type { Group } from "@/types";

const categories = ["Tümü", "Akademik", "Teknoloji", "Spor", "Sanat", "Sosyal"];

export default function GroupsPage() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState("Akademik");

  const toggleMembership = (id: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              isMember: !g.isMember,
              memberCount: g.isMember ? g.memberCount - 1 : g.memberCount + 1,
            }
          : g,
      ),
    );
  };

  const handleCreateGroup = () => {
    if (!newName.trim()) return;
    const newGroup: Group = {
      id: `g-${Date.now()}`,
      name: newName.trim(),
      description: newDesc.trim() || "Yeni oluşturulmuş grup.",
      category: newCat,
      memberCount: 1,
      creatorName: user?.fullName || "Kullanıcı",
      isMember: true,
    };
    setGroups([newGroup, ...groups]);
    setNewName("");
    setNewDesc("");
    setNewCat("Akademik");
    setDialogOpen(false);
  };

  const filtered = groups.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === "Tümü" || g.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Gruplar</h1>
          <p className="text-muted-foreground mt-1">
            İlgi alanına uygun gruplara katıl, yeni insanlarla tanış
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 self-start">
              <Plus className="w-4 h-4" />
              Grup Oluştur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Grup Oluştur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Grup Adı</Label>
                <Input
                  placeholder="Grup adını girin"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <textarea
                  placeholder="Grup hakkında kısa bir açıklama..."
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label>Kategori</Label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {categories.filter((c) => c !== "Tümü").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <Button className="w-full" onClick={handleCreateGroup} disabled={!newName.trim()}>
                Grubu Oluştur
              </Button>
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
            placeholder="Grup ara..."
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((group) => (
          <Card key={group.id} className="overflow-hidden">
            {group.imageUrl && (
              <img
                src={group.imageUrl}
                alt={group.name}
                className="w-full h-36 object-cover"
              />
            )}
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{group.name}</h3>
                  <Badge variant="secondary" className="mt-1 text-[10px]">
                    {group.category}
                  </Badge>
                </div>
                {group.isMember && (
                  <Badge variant="success" className="shrink-0">Üye</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {group.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  {group.memberCount} üye
                </span>
                <Button
                  variant={group.isMember ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleMembership(group.id)}
                >
                  {group.isMember ? "Ayrıl" : "Katıl"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p className="text-lg font-medium">Sonuç bulunamadı</p>
          <p className="text-sm mt-1">Farklı anahtar kelimeler veya kategori deneyin.</p>
        </div>
      )}
    </div>
  );
}
