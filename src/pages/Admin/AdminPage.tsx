import {
  Users,
  MessageSquare,
  ShoppingBag,
  Calendar,
  TrendingUp,
  Eye,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const userGrowthData = [
  { month: "Eki", users: 45 },
  { month: "Kas", users: 89 },
  { month: "Ara", users: 132 },
  { month: "Oca", users: 198 },
  { month: "Şub", users: 287 },
  { month: "Mar", users: 356 },
];

const featureUsageData = [
  { feature: "Feed", usage: 420 },
  { feature: "Chatbot", usage: 380 },
  { feature: "Pazar", usage: 310 },
  { feature: "Görsel Arama", usage: 190 },
  { feature: "Etkinlikler", usage: 260 },
  { feature: "İndirimler", usage: 220 },
];

const satisfactionData = [
  { name: "Çok Memnun", value: 45, color: "#10B981" },
  { name: "Memnun", value: 30, color: "#6366F1" },
  { name: "Nötr", value: 15, color: "#F59E0B" },
  { name: "Memnun Değil", value: 10, color: "#EF4444" },
];

const recentUsers = [
  { name: "Zeynep Demir", email: "zeynep@erdogan.edu.tr", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Zeynep", status: "active" },
  { name: "Ali Yıldız", email: "ali@erdogan.edu.tr", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ali", status: "active" },
  { name: "Selin Arslan", email: "selin@erdogan.edu.tr", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Selin", status: "pending" },
  { name: "Mehmet Kaya", email: "mehmet@erdogan.edu.tr", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mehmet", status: "active" },
  { name: "Ayşe Mandıralı", email: "ayse@erdogan.edu.tr", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ayse", status: "active" },
];

const reports = [
  { id: 1, type: "Uygunsuz İçerik", user: "Anonim", content: "Feed'de uygunsuz bir gönderi mevcut.", status: "pending" },
  { id: 2, type: "Spam", user: "Ali Yıldız", content: "Marketplace'te tekrarlayan ilan.", status: "resolved" },
  { id: 3, type: "Yanlış Bilgi", user: "Zeynep Demir", content: "Chatbot yanlış sınav tarihi verdi.", status: "pending" },
];

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Admin Paneli</h1>
        <p className="text-muted-foreground mt-1">
          Platform istatistikleri ve yönetim araçları
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Toplam Kullanıcı", value: "356", trend: "+23 bu ay" },
          { icon: MessageSquare, label: "Chatbot Oturumu", value: "1,204", trend: "+156 bu hafta" },
          { icon: ShoppingBag, label: "Aktif İlan", value: "89" },
          { icon: Calendar, label: "Planlı Etkinlik", value: "12" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  {stat.trend && (
                    <p className="text-xs text-success flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-3 h-3" />{stat.trend}
                    </p>
                  )}
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
          <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
          <TabsTrigger value="moderation">Moderasyon</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Kullanıcı Büyümesi</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="#6366F1" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Özellik Kullanımı</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={featureUsageData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="feature" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="usage" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Kullanıcı Memnuniyeti</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={satisfactionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {satisfactionData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {satisfactionData.map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                        <span className="text-sm font-bold ml-auto">%{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Son Kayıt Olan Kullanıcılar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.map((u) => (
                  <div key={u.email} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <Badge variant={u.status === "active" ? "success" : "secondary"}>
                      {u.status === "active" ? "Aktif" : "Beklemede"}
                    </Badge>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Raporlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl border">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    r.status === "pending" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"
                  }`}>
                    {r.status === "pending" ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{r.type}</span>
                      <Badge variant={r.status === "pending" ? "secondary" : "success"} className="text-[10px]">
                        {r.status === "pending" ? "Beklemede" : "Çözüldü"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{r.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">Bildiren: {r.user}</p>
                  </div>
                  {r.status === "pending" && (
                    <Button variant="outline" size="sm">İncele</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
