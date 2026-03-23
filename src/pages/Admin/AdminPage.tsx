import { useMemo } from "react";
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
  { feature: "Arama", usage: 190 },
  { feature: "Etkinlik", usage: 260 },
  { feature: "İndirim", usage: 220 },
];

const satisfactionData = [
  { name: "Çok Memnun", value: 45, color: "#10B981" },
  { name: "Memnun", value: 30, color: "#6366F1" },
  { name: "Nötr", value: 15, color: "#F59E0B" },
  { name: "Memnun Değil", value: 10, color: "#EF4444" },
];

const recentUsers = [
  {
    name: "Zeynep Demir",
    email: "zeynep@erdogan.edu.tr",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Zeynep",
    status: "active",
    date: "22 Mar 2026",
  },
  {
    name: "Ali Yıldız",
    email: "ali@erdogan.edu.tr",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ali",
    status: "active",
    date: "21 Mar 2026",
  },
  {
    name: "Selin Arslan",
    email: "selin@erdogan.edu.tr",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Selin",
    status: "pending",
    date: "20 Mar 2026",
  },
  {
    name: "Mehmet Kaya",
    email: "mehmet@erdogan.edu.tr",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mehmet",
    status: "active",
    date: "19 Mar 2026",
  },
  {
    name: "Ayşe Mandıralı",
    email: "ayse@erdogan.edu.tr",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ayse",
    status: "active",
    date: "18 Mar 2026",
  },
];

const reports = [
  {
    id: 1,
    type: "Uygunsuz İçerik",
    user: "Anonim",
    content: "Feed'de uygunsuz bir gönderi mevcut.",
    status: "pending",
    date: "22 Mar",
  },
  {
    id: 2,
    type: "Spam",
    user: "Ali Yıldız",
    content: "Marketplace'te tekrarlayan ilan.",
    status: "resolved",
    date: "21 Mar",
  },
  {
    id: 3,
    type: "Yanlış Bilgi",
    user: "Zeynep Demir",
    content: "Chatbot yanlış sınav tarihi verdi.",
    status: "pending",
    date: "20 Mar",
  },
];

const stats = [
  {
    icon: Users,
    label: "Toplam Kullanıcı",
    value: "356",
    trend: "+23 bu ay",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: MessageSquare,
    label: "Chatbot Oturumu",
    value: "1,204",
    trend: "+156 bu hafta",
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    icon: ShoppingBag,
    label: "Aktif İlan",
    value: "89",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: Calendar,
    label: "Planlı Etkinlik",
    value: "12",
    color: "bg-amber-500/10 text-amber-600",
  },
];

export default function AdminPage() {
  const chartColors = useMemo(
    () => ({
      primary: "#6366F1",
      grid: "rgba(100,100,100,0.15)",
    }),
    []
  );

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
          Admin Paneli
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Platform istatistikleri ve yönetim araçları
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                  <p className="text-xl lg:text-2xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  {stat.trend && (
                    <p className="text-[11px] text-success flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </p>
                  )}
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="bg-secondary/50">
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
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartColors.grid}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid rgba(100,100,100,0.2)",
                        fontSize: 13,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke={chartColors.primary}
                      strokeWidth={2.5}
                      dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Özellik Kullanımı</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={featureUsageData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={chartColors.grid}
                    />
                    <XAxis
                      dataKey="feature"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid rgba(100,100,100,0.2)",
                        fontSize: 13,
                      }}
                    />
                    <Bar
                      dataKey="usage"
                      fill={chartColors.primary}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">
                  Kullanıcı Memnuniyeti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={satisfactionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {satisfactionData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid rgba(100,100,100,0.2)",
                          fontSize: 13,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 flex-1">
                    {satisfactionData.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm flex-1">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden hidden sm:block">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${item.value}%`,
                                backgroundColor: item.color,
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold w-8 text-right">
                            %{item.value}
                          </span>
                        </div>
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
              <CardTitle className="text-base">
                Son Kayıt Olan Kullanıcılar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {recentUsers.map((u) => (
                  <div
                    key={u.email}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {u.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{u.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {u.email}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {u.date}
                    </span>
                    <Badge
                      variant={u.status === "active" ? "success" : "secondary"}
                    >
                      {u.status === "active" ? "Aktif" : "Beklemede"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground"
                    >
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
            <CardContent className="space-y-2">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="flex items-start gap-3 p-3 rounded-xl border"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      r.status === "pending"
                        ? "bg-amber-500/10 text-amber-600"
                        : "bg-emerald-500/10 text-emerald-600"
                    }`}
                  >
                    {r.status === "pending" ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{r.type}</span>
                      <Badge
                        variant={
                          r.status === "pending" ? "secondary" : "success"
                        }
                        className="text-[10px]"
                      >
                        {r.status === "pending" ? "Beklemede" : "Çözüldü"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {r.content}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        Bildiren: {r.user}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        · {r.date}
                      </span>
                    </div>
                  </div>
                  {r.status === "pending" && (
                    <Button variant="outline" size="sm" className="shrink-0">
                      İncele
                    </Button>
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
