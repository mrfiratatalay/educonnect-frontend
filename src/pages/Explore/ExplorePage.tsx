import { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Users,
  Tag,
  Plus,
  MapPin,
  Clock,
  Copy,
  Check,
  Lock,
  Globe,
  X,
  UserPlus,
  Info,
  Building2,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  mockEvents,
  mockGroups,
  mockDiscounts,
  mockUsers,
  otherUniversityEvents,
  otherUniversityGroups,
} from "@/data/mock";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import type { Event, Group } from "@/types";

type TabKey = "events" | "groups" | "discounts";
type ScopeFilter = "campus" | "national";

const tabsList: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "events", label: "Etkinlikler", icon: Calendar },
  { key: "groups", label: "Gruplar", icon: Users },
  { key: "discounts", label: "İndirimler", icon: Tag },
];

const groupCategories = ["Akademik", "Teknoloji", "Spor", "Sanat", "Sosyal"];

export default function ExplorePage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabKey>("events");
  const [searchQuery, setSearchQuery] = useState("");
  const [scope, setScope] = useState<ScopeFilter>("campus");

  const [events, setEvents] = useState(mockEvents);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pendingGroups, setPendingGroups] = useState<Set<string>>(new Set());

  // Detail modals
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Leave confirmation
  const [leaveGroupId, setLeaveGroupId] = useState<string | null>(null);

  // Event creation
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventCapacity, setNewEventCapacity] = useState("50");
  const [eventDateError, setEventDateError] = useState("");

  // Group creation
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [newGroupCat, setNewGroupCat] = useState("Akademik");
  const [newGroupPrivacy, setNewGroupPrivacy] = useState<"open" | "closed">("open");

  const isFull = (e: Event) => e.currentParticipants >= e.maxParticipants;

  const toggleRegistration = (id: string) => {
    const event = events.find((e) => e.id === id);
    if (!event) return;
    if (!event.isRegistered && isFull(event)) return;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              isRegistered: !e.isRegistered,
              currentParticipants: e.isRegistered
                ? e.currentParticipants - 1
                : e.currentParticipants + 1,
            }
          : e,
      ),
    );
    if (selectedEvent?.id === id) {
      setSelectedEvent((prev) =>
        prev
          ? {
              ...prev,
              isRegistered: !prev.isRegistered,
              currentParticipants: prev.isRegistered
                ? prev.currentParticipants - 1
                : prev.currentParticipants + 1,
            }
          : null,
      );
    }
  };

  const handleGroupAction = (id: string) => {
    const group = groups.find((g) => g.id === id);
    if (!group) return;

    if (group.isMember) {
      setLeaveGroupId(id);
      return;
    }

    if (group.privacy === "closed") {
      setPendingGroups((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
      return;
    }

    toggleMembershipDirect(id);
  };

  const toggleMembershipDirect = (id: string) => {
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
    setPendingGroups((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const confirmLeaveGroup = () => {
    if (leaveGroupId) {
      toggleMembershipDirect(leaveGroupId);
      if (selectedGroup?.id === leaveGroupId) {
        setSelectedGroup((prev) =>
          prev
            ? { ...prev, isMember: false, memberCount: prev.memberCount - 1 }
            : null,
        );
      }
      setLeaveGroupId(null);
    }
  };

  const copyCode = (id: string, code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateEvent = () => {
    if (!newEventTitle.trim()) return;
    if (newEventDate && new Date(newEventDate) < new Date()) {
      setEventDateError("Geçmiş tarihli etkinlik oluşturulamaz.");
      return;
    }
    setEventDateError("");
    const newEvent: Event = {
      id: `e-${Date.now()}`,
      title: newEventTitle.trim(),
      description: newEventDesc.trim() || "Yeni etkinlik.",
      location: newEventLocation.trim() || "Kampüs",
      startDate: newEventDate ? new Date(newEventDate).toISOString() : new Date().toISOString(),
      endDate: newEventDate ? new Date(newEventDate).toISOString() : new Date().toISOString(),
      creatorName: user?.fullName || "Kullanıcı",
      maxParticipants: parseInt(newEventCapacity) || 50,
      currentParticipants: 0,
      isRegistered: false,
    };
    setEvents([newEvent, ...events]);
    setNewEventTitle("");
    setNewEventDesc("");
    setNewEventLocation("");
    setNewEventDate("");
    setNewEventCapacity("50");
    setEventDialogOpen(false);
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const newGroup: Group = {
      id: `g-${Date.now()}`,
      name: newGroupName.trim(),
      description: newGroupDesc.trim() || "Yeni oluşturulmuş grup.",
      category: newGroupCat,
      memberCount: 1,
      creatorName: user?.fullName || "Kullanıcı",
      isMember: true,
      privacy: newGroupPrivacy,
    };
    setGroups([newGroup, ...groups]);
    setNewGroupName("");
    setNewGroupDesc("");
    setNewGroupCat("Akademik");
    setNewGroupPrivacy("open");
    setGroupDialogOpen(false);
  };

  const q = searchQuery.toLowerCase();

  const scopedEvents = useMemo(
    () => scope === "campus" ? events : [...events, ...otherUniversityEvents],
    [events, scope],
  );

  const filteredEvents = useMemo(
    () =>
      scopedEvents.filter(
        (e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q),
      ),
    [scopedEvents, q],
  );

  const scopedGroups = useMemo(
    () => scope === "campus" ? groups : [...groups, ...otherUniversityGroups],
    [groups, scope],
  );

  const filteredGroups = useMemo(
    () => scopedGroups.filter((g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)),
    [scopedGroups, q],
  );

  const filteredDiscounts = useMemo(
    () =>
      mockDiscounts.filter(
        (d) => d.businessName.toLowerCase().includes(q) || d.title.toLowerCase().includes(q),
      ),
    [q],
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  const fillPercent = (current: number, max: number) => Math.round((current / max) * 100);

  const daysLeft = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const currentResults =
    activeTab === "events" ? filteredEvents.length :
    activeTab === "groups" ? filteredGroups.length :
    filteredDiscounts.length;

  const getGroupButtonState = (group: Group) => {
    if (group.isMember) return { label: "Ayrıl", variant: "outline" as const };
    if (pendingGroups.has(group.id)) return { label: "İstek Gönderildi", variant: "outline" as const };
    return { label: "Katıl", variant: "default" as const };
  };

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Keşfet</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 self-start shadow-sm">
              <Plus className="w-4 h-4" />
              Oluştur
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEventDialogOpen(true)} className="gap-2">
              <Calendar className="w-4 h-4" />
              Etkinlik Oluştur
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setGroupDialogOpen(true)} className="gap-2">
              <Users className="w-4 h-4" />
              Grup Oluştur
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Scope + Search + Tabs — single row */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Scope Toggle */}
          <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg shrink-0">
            <button
              onClick={() => setScope("campus")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer",
                scope === "campus"
                  ? "bg-background shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Building2 className="w-3.5 h-3.5" />
              RTEÜ
            </button>
            <button
              onClick={() => setScope("national")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer",
                scope === "national"
                  ? "bg-background shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Tümü
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ara..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary/50 rounded-lg p-1 w-fit">
          {tabsList.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer whitespace-nowrap",
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Events */}
        {activeTab === "events" && filteredEvents.length > 0 && (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  {event.imageUrl && (
                    <div className="relative overflow-hidden bg-secondary/30">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover" />
                      <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] gap-1"><Calendar className="w-3 h-3" />Etkinlik</Badge>
                      {event.isRegistered && <Badge variant="success" className="absolute top-2 right-2 text-[10px]">Kayıtlı</Badge>}
                      {isFull(event) && !event.isRegistered && <Badge variant="destructive" className="absolute top-2 right-2 text-[10px]">Yer Yok</Badge>}
                    </div>
                  )}
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold line-clamp-1 flex-1">{event.title}</h3>
                        {scope === "national" && event.universityName && (
                          <Badge variant="outline" className="text-[10px] shrink-0 gap-1 border-blue-500/30 text-blue-600">
                            <GraduationCap className="w-3 h-3" />
                            {event.universityName}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{event.description}</p>
                    </div>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 shrink-0" />{formatDate(event.startDate)}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{event.location}</span></div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">{event.currentParticipants}/{event.maxParticipants}</span>
                        {isFull(event) ? <span className="font-medium text-destructive">Dolu</span> : <span className="font-medium">%{fillPercent(event.currentParticipants, event.maxParticipants)}</span>}
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-500", isFull(event) ? "bg-destructive" : "bg-primary")} style={{ width: `${Math.min(fillPercent(event.currentParticipants, event.maxParticipants), 100)}%` }} />
                      </div>
                    </div>
                    <Button
                      variant={event.isRegistered ? "outline" : "default"}
                      size="sm"
                      className="w-full"
                      disabled={isFull(event) && !event.isRegistered}
                      onClick={(e) => { e.stopPropagation(); toggleRegistration(event.id); }}
                    >
                      {isFull(event) && !event.isRegistered ? "Yer Yok" : event.isRegistered ? "Kaydı İptal Et" : "Katıl"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Groups */}
        {activeTab === "groups" && filteredGroups.length > 0 && (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredGroups.map((group) => {
                const btnState = getGroupButtonState(group);
                return (
                  <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedGroup(group)}>
                    {group.imageUrl ? (
                      <div className="relative overflow-hidden bg-secondary/30">
                        <img src={group.imageUrl} alt={group.name} className="w-full h-36 object-cover" />
                        <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] gap-1"><Users className="w-3 h-3" />Grup</Badge>
                        {group.isMember && <Badge variant="success" className="absolute top-2 right-2 text-[10px]">Üye</Badge>}
                      </div>
                    ) : (
                      <div className="relative h-36 bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
                        <Users className="w-10 h-10 text-muted-foreground/30" />
                        <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] gap-1"><Users className="w-3 h-3" />Grup</Badge>
                        {group.isMember && <Badge variant="success" className="absolute top-2 right-2 text-[10px]">Üye</Badge>}
                      </div>
                    )}
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold flex-1">{group.name}</h3>
                          {scope === "national" && group.universityName && (
                            <Badge variant="outline" className="text-[10px] shrink-0 gap-1 border-blue-500/30 text-blue-600">
                              <GraduationCap className="w-3 h-3" />
                              {group.universityName}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="secondary" className="text-[10px]">{group.category}</Badge>
                          {group.privacy === "closed" && <Badge variant="outline" className="text-[10px] gap-1"><Lock className="w-3 h-3" />Kapalı</Badge>}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Users className="w-3.5 h-3.5" />{group.memberCount} üye</span>
                        <Button variant={btnState.variant} size="sm" onClick={(e) => { e.stopPropagation(); handleGroupAction(group.id); }}>
                          {btnState.label}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Discounts */}
        {activeTab === "discounts" && filteredDiscounts.length > 0 && (
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDiscounts.map((discount) => (
                <Card key={discount.id} className="overflow-hidden relative hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-accent/8 rounded-bl-[3rem]" />
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Tag className="w-5 h-5 text-primary" /></div>
                        <div>
                          <h3 className="font-semibold text-sm">{discount.businessName}</h3>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5"><Clock className="w-3 h-3" />{daysLeft(discount.validUntil)} gün kaldı</div>
                        </div>
                      </div>
                      <Badge variant="accent" className="text-sm font-bold px-2.5 shrink-0">%{discount.discountRate}</Badge>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{discount.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{discount.description}</p>
                    </div>
                    {discount.code && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 rounded-lg bg-secondary/70 border border-dashed font-mono text-sm text-center tracking-wider select-all">{discount.code}</div>
                        <Button variant="outline" size="icon" className="shrink-0 h-9 w-9" onClick={() => copyCode(discount.id, discount.code)}>
                          {copiedId === discount.id ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Empty State */}
      {currentResults === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Sonuç bulunamadı</p>
          <p className="text-sm mt-1">Farklı anahtar kelimeler deneyin.</p>
        </div>
      )}

      {/* Event Detail Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
              </DialogHeader>
              {selectedEvent.imageUrl && (
                <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-48 object-cover rounded-lg" />
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">{selectedEvent.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4 text-primary shrink-0" />{formatDate(selectedEvent.startDate)}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4 text-primary shrink-0" />{formatTime(selectedEvent.startDate)} - {formatTime(selectedEvent.endDate)}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4 text-primary shrink-0" />{selectedEvent.location}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Users className="w-4 h-4 text-primary shrink-0" />{selectedEvent.currentParticipants}/{selectedEvent.maxParticipants} katılımcı</div>
              </div>
              {selectedEvent.groupName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Info className="w-4 h-4 text-primary" />Düzenleyen: {selectedEvent.groupName}</div>
              )}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Kontenjan</span>
                  {isFull(selectedEvent) ? <span className="font-medium text-destructive">Dolu</span> : <span className="font-medium">%{fillPercent(selectedEvent.currentParticipants, selectedEvent.maxParticipants)}</span>}
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-500", isFull(selectedEvent) ? "bg-destructive" : "bg-primary")} style={{ width: `${Math.min(fillPercent(selectedEvent.currentParticipants, selectedEvent.maxParticipants), 100)}%` }} />
                </div>
              </div>
              <Button
                variant={selectedEvent.isRegistered ? "outline" : "default"}
                className="w-full"
                disabled={isFull(selectedEvent) && !selectedEvent.isRegistered}
                onClick={() => toggleRegistration(selectedEvent.id)}
              >
                {isFull(selectedEvent) && !selectedEvent.isRegistered ? "Kontenjan Doldu" : selectedEvent.isRegistered ? "Kaydı İptal Et" : "Etkinliğe Katıl"}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Group Detail Modal */}
      <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedGroup && (() => {
            const liveGroup = groups.find((g) => g.id === selectedGroup.id) || selectedGroup;
            const btnState = getGroupButtonState(liveGroup);
            return (
              <>
                <DialogHeader>
                  <DialogTitle>{liveGroup.name}</DialogTitle>
                </DialogHeader>
                {liveGroup.imageUrl && (
                  <img src={liveGroup.imageUrl} alt={liveGroup.name} className="w-full h-44 object-cover rounded-lg" />
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary">{liveGroup.category}</Badge>
                  {liveGroup.privacy === "closed" ? (
                    <Badge variant="outline" className="gap-1"><Lock className="w-3 h-3" />Kapalı Grup</Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1"><Globe className="w-3 h-3" />Herkese Açık</Badge>
                  )}
                  {liveGroup.isMember && <Badge variant="success">Üye</Badge>}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{liveGroup.description}</p>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-primary" />Üyeler ({liveGroup.memberCount})</h4>
                  <div className="space-y-2">
                    {mockUsers.slice(0, Math.min(4, liveGroup.memberCount)).map((u) => (
                      <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/40">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">{u.fullName.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{u.fullName}</p>
                          <p className="text-[11px] text-muted-foreground">{u.department}</p>
                        </div>
                        {u.fullName === liveGroup.creatorName && <Badge variant="outline" className="text-[10px]">Yönetici</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  variant={btnState.variant}
                  className="w-full gap-2"
                  onClick={() => handleGroupAction(liveGroup.id)}
                >
                  {!liveGroup.isMember && !pendingGroups.has(liveGroup.id) && <UserPlus className="w-4 h-4" />}
                  {btnState.label}
                </Button>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Leave Group Confirmation */}
      <Dialog open={!!leaveGroupId} onOpenChange={() => setLeaveGroupId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Gruptan Ayrıl</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Bu gruptan ayrılmak istediğinize emin misiniz? Grubun içerikleri artık feed'inizde görünmeyecektir.
          </p>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setLeaveGroupId(null)}>İptal</Button>
            <Button variant="destructive" className="flex-1" onClick={confirmLeaveGroup}>Ayrıl</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Creation Dialog */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Yeni Etkinlik Oluştur</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Etkinlik Adı</Label>
              <Input placeholder="Etkinlik adını girin" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Açıklama</Label>
              <textarea placeholder="Etkinlik hakkında kısa bir açıklama..." rows={3} value={newEventDesc} onChange={(e) => setNewEventDesc(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Konum</Label><Input placeholder="Ör: Amfi 3" value={newEventLocation} onChange={(e) => setNewEventLocation(e.target.value)} /></div>
              <div className="space-y-2"><Label>Kontenjan</Label><Input type="number" value={newEventCapacity} onChange={(e) => setNewEventCapacity(e.target.value)} /></div>
            </div>
            <div className="space-y-2">
              <Label>Tarih ve Saat</Label>
              <Input type="datetime-local" value={newEventDate} onChange={(e) => { setNewEventDate(e.target.value); setEventDateError(""); }} />
              {eventDateError && <p className="text-xs text-destructive">{eventDateError}</p>}
            </div>
            <Button className="w-full" onClick={handleCreateEvent} disabled={!newEventTitle.trim()}>Etkinliği Oluştur</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Group Creation Dialog */}
      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Yeni Grup Oluştur</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2"><Label>Grup Adı</Label><Input placeholder="Grup adını girin" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>Açıklama</Label>
              <textarea placeholder="Grup hakkında kısa bir açıklama..." rows={3} value={newGroupDesc} onChange={(e) => setNewGroupDesc(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kategori</Label>
                <select value={newGroupCat} onChange={(e) => setNewGroupCat(e.target.value)} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {groupCategories.map((c) => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Gizlilik</Label>
                <div className="flex gap-2 pt-1">
                  <Button type="button" variant={newGroupPrivacy === "open" ? "default" : "outline"} size="sm" onClick={() => setNewGroupPrivacy("open")} className="gap-1.5 flex-1"><Globe className="w-3.5 h-3.5" />Açık</Button>
                  <Button type="button" variant={newGroupPrivacy === "closed" ? "default" : "outline"} size="sm" onClick={() => setNewGroupPrivacy("closed")} className="gap-1.5 flex-1"><Lock className="w-3.5 h-3.5" />Kapalı</Button>
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={handleCreateGroup} disabled={!newGroupName.trim()}>Grubu Oluştur</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
