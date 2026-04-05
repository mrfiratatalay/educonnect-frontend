import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Check, LogOut, Moon, Palette, Sun, User, ShieldAlert, Camera } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  Flex,
  Form,
  Grid,
  Input,
  Select,
  Spin,
  Typography,
  theme,
  Tabs,
  Segmented,
  Avatar,
  Upload,
  Popconfirm
} from "antd";
import { getApiErrorMessage, getUniversities } from "@/features/auth/api";
import {
  useMyProfileQuery,
  useUploadMyAvatarMutation,
  useUpdateMyProfileMutation,
} from "@/features/users/hooks";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import type { UploadProps } from "antd";

const settingsSchema = z.object({
  fullName: z.string().min(3, "Ad soyad en az 3 karakter olmali"),
  universityId: z.string().min(1, "Universite seciniz"),
  department: z.string().min(2, "Bolum en az 2 karakter olmali"),
  year: z.string().min(1, "Sinif seciniz"),
  bio: z.string().max(500, "Biyografi en fazla 500 karakter olabilir").optional(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const logout = useAuthStore((state) => state.logout);
  const profileQuery = useMyProfileQuery();
  const updateProfileMutation = useUpdateMyProfileMutation();
  const uploadAvatarMutation = useUploadMyAvatarMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const isDark = useThemeStore((state) => state.isDark);
  const toggleTheme = useThemeStore((state) => state.toggle);
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();

  const { data: universities = [], isLoading: isUniversitiesLoading } = useQuery({
    queryKey: ["universities"],
    queryFn: getUniversities,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fullName: "",
      universityId: "",
      department: "",
      year: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (!profileQuery.data) return;

    reset({
      fullName: profileQuery.data.fullName,
      universityId: profileQuery.data.universityId || "",
      department: profileQuery.data.department || "",
      year: profileQuery.data.year ? String(profileQuery.data.year) : "",
      bio: profileQuery.data.bio || "",
    });
  }, [profileQuery.data, reset]);

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    setProfileSaved(false);

    try {
      await updateProfileMutation.mutateAsync({
        fullName: data.fullName,
        universityId: data.universityId,
        department: data.department,
        year: Number(data.year),
        bio: data.bio?.trim() || undefined,
      });
      setProfileSaved(true);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  });

  const avatarUploadProps: UploadProps = {
    name: "file",
    showUploadList: false,
    accept: "image/png,image/jpeg,image/gif",
    beforeUpload: (file) => {
      const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

      if (!allowedTypes.includes(file.type)) {
        setSubmitError("Sadece JPG, PNG veya GIF dosyalari yukleyebilirsiniz.");
        return Upload.LIST_IGNORE;
      }

      if (file.size / 1024 / 1024 >= 5) {
        setSubmitError("Profil fotografi en fazla 5MB olabilir.");
        return Upload.LIST_IGNORE;
      }

      setSubmitError(null);
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        await uploadAvatarMutation.mutateAsync(file as File);
        onSuccess?.("ok");
      } catch (error) {
        onError?.(error as Error);
        setSubmitError(getApiErrorMessage(error));
      }
    },
  };

  const pagePadding = screens.xs ? 16 : screens.lg ? 32 : 24;

  if (profileQuery.isLoading) {
    return (
      <Flex justify="center" align="center" style={{ padding: 80 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div style={{ padding: pagePadding, maxWidth: 720, margin: "0 auto" }}>
        <Alert type="error" showIcon message="Profil bilgileri yuklenemedi." />
      </div>
    );
  }

  return (
    <div style={{ padding: pagePadding, maxWidth: 900, margin: "0 auto" }}>
      <Flex vertical gap={32}>
        <div>
          <Typography.Title level={screens.lg ? 2 : 3} style={{ margin: 0, fontWeight: 800, letterSpacing: "-0.5px" }}>
            Ayarlar
          </Typography.Title>
          <Typography.Text type="secondary">
            Hesap tercihlerinizi ve profil detaylarınızı yönetin.
          </Typography.Text>
        </div>

        <Tabs
          tabPosition={screens.lg ? "left" : "top"}
          size="large"
          items={[
            {
              key: "profile",
              label: (
                <span style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: screens.lg ? 60 : 0 }}>
                  <User size={16} /> Profil Bilgileri
                </span>
              ),
              children: (
                <div style={{ paddingLeft: screens.lg ? 32 : 0 }}>
                  <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                    <Flex vertical gap={32}>
                      <Flex gap={24} align="center" wrap="wrap">
                        <Upload {...avatarUploadProps} disabled={uploadAvatarMutation.isPending}>
                          <div style={{ position: "relative", cursor: "pointer", borderRadius: "50%" }}>
                            <Avatar size={96} src={profileQuery.data.avatarUrl} style={{ backgroundColor: token.colorPrimary, fontSize: 32 }}>
                              {profileQuery.data.fullName?.charAt(0)}
                            </Avatar>
                            <div style={{ 
                              position: "absolute", bottom: 0, right: 0, 
                              background: token.colorBgContainer, borderRadius: "50%", 
                              padding: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                              display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                              <Camera size={16} color={token.colorPrimary} />
                            </div>
                          </div>
                        </Upload>
                        <div>
                          <Typography.Title level={5} style={{ margin: 0 }}>Profil Fotoğrafı</Typography.Title>
                          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                            JPG, GIF veya PNG. Maksimum 5MB.
                          </Typography.Text>
                        </div>
                      </Flex>

                      <Form layout="vertical" requiredMark={false} onFinish={onSubmit}>
                        <Flex gap={16} wrap="wrap">
                          <Form.Item
                            label={<Typography.Text strong>Ad Soyad</Typography.Text>}
                            validateStatus={errors.fullName ? "error" : undefined}
                            help={errors.fullName?.message}
                            style={{ flex: "1 1 250px" }}
                          >
                            <Controller
                              name="fullName"
                              control={control}
                              render={({ field }) => <Input size="large" {...field} />}
                            />
                          </Form.Item>

                          <Form.Item label={<Typography.Text strong>E-posta</Typography.Text>} style={{ flex: "1 1 250px" }}>
                            <Input
                              size="large"
                              value={profileQuery.data.email}
                              disabled
                              readOnly
                              type="email"
                            />
                          </Form.Item>
                        </Flex>

                        <Flex gap={16} wrap="wrap">
                          <Form.Item
                            label={<Typography.Text strong>Üniversite</Typography.Text>}
                            validateStatus={errors.universityId ? "error" : undefined}
                            help={errors.universityId?.message}
                            style={{ flex: "1 1 250px" }}
                          >
                            <Controller
                              name="universityId"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  size="large"
                                  {...field}
                                  loading={isUniversitiesLoading}
                                  placeholder="Seçiniz"
                                  options={universities.map((uni) => ({
                                    value: uni.id,
                                    label: uni.name,
                                  }))}
                                />
                              )}
                            />
                          </Form.Item>

                          <Form.Item
                            label={<Typography.Text strong>Bölüm</Typography.Text>}
                            validateStatus={errors.department ? "error" : undefined}
                            help={errors.department?.message}
                            style={{ flex: "1 1 250px" }}
                          >
                            <Controller
                              name="department"
                              control={control}
                              render={({ field }) => <Input size="large" {...field} />}
                            />
                          </Form.Item>
                        </Flex>

                        <Form.Item
                          label={<Typography.Text strong>Sınıf</Typography.Text>}
                          validateStatus={errors.year ? "error" : undefined}
                          help={errors.year?.message}
                        >
                          <Controller
                            name="year"
                            control={control}
                            render={({ field }) => (
                              <Select
                                size="large"
                                {...field}
                                placeholder="Seçiniz"
                                options={Array.from({ length: 8 }, (_, i) => ({
                                  value: String(i + 1),
                                  label: `${i + 1}. sınıf`,
                                }))}
                              />
                            )}
                          />
                        </Form.Item>

                        <Form.Item
                          label={<Typography.Text strong>Hakkımda (Bio)</Typography.Text>}
                          validateStatus={errors.bio ? "error" : undefined}
                          help={errors.bio?.message}
                        >
                          <Controller
                            name="bio"
                            control={control}
                            render={({ field }) => (
                              <Input.TextArea
                                {...field}
                                size="large"
                                rows={4}
                                maxLength={500}
                                showCount
                                autoSize={{ minRows: 3, maxRows: 6 }}
                              />
                            )}
                          />
                        </Form.Item>

                        {submitError && (
                          <Alert type="error" showIcon message={submitError} style={{ marginBottom: 24, borderRadius: 8 }} />
                        )}

                        <div style={{ 
                          position: "sticky", 
                          bottom: 0, 
                          padding: "16px 0", 
                          background: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, ${token.colorBgContainer} 20%)`,
                          zIndex: 10,
                          marginTop: 16
                        }}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={updateProfileMutation.isPending}
                            icon={profileSaved ? <Check size={16} /> : undefined}
                            style={{ borderRadius: 8, padding: "0 32px", boxShadow: `0 4px 12px ${token.colorPrimary}40` }}
                          >
                            {updateProfileMutation.isPending ? "Kaydediliyor..." : profileSaved ? "Kaydedildi" : "Değişiklikleri Kaydet"}
                          </Button>
                        </div>
                      </Form>
                    </Flex>
                  </Card>
                </div>
              )
            },
            {
              key: "appearance",
              label: (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Palette size={16} /> Görünüm
                </span>
              ),
              children: (
                <div style={{ paddingLeft: screens.lg ? 32 : 0 }}>
                  <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
                    <Flex vertical gap={24}>
                      <div>
                        <Typography.Title level={5} style={{ margin: 0 }}>Tema Tercihi</Typography.Title>
                        <Typography.Text type="secondary">
                          Arayüzün görünümünü kendi göz zevkinize göre özelleştirin.
                        </Typography.Text>
                      </div>
                      
                      <div style={{ padding: 24, background: token.colorFillQuaternary, borderRadius: 12 }}>
                        <Segmented
                          size="large"
                          block
                          value={isDark ? "dark" : "light"}
                          onChange={(val) => {
                            if ((val === "dark") !== isDark) toggleTheme();
                          }}
                          options={[
                            {
                              label: (
                                <Flex align="center" justify="center" gap={8} style={{ padding: "4px 0" }}>
                                  <Sun size={16} /> Aydınlık
                                </Flex>
                              ),
                              value: "light",
                            },
                            {
                              label: (
                                <Flex align="center" justify="center" gap={8} style={{ padding: "4px 0" }}>
                                  <Moon size={16} /> Karanlık
                                </Flex>
                              ),
                              value: "dark",
                            },
                          ]}
                        />
                      </div>
                    </Flex>
                  </Card>
                </div>
              )
            },
            {
              key: "security",
              label: (
                <span style={{ display: "flex", alignItems: "center", gap: 8, color: token.colorError }}>
                  <ShieldAlert size={16} /> Hesap
                </span>
              ),
              children: (
                <div style={{ paddingLeft: screens.lg ? 32 : 0 }}>
                  <Card 
                    bordered={false} 
                    style={{ borderRadius: 16, border: `1px solid ${token.colorErrorBorder}`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
                  >
                    <Flex vertical gap={24}>
                      <div>
                        <Typography.Title level={5} type="danger" style={{ margin: 0 }}>Tehlikeli Bölge</Typography.Title>
                        <Typography.Text type="secondary">
                          Oturumu sonlandırmak veya hesap verilerinizle ilgili kritik işlemleri buradan yapabilirsiniz.
                        </Typography.Text>
                      </div>
                      
                      <div style={{ padding: 20, background: token.colorErrorBg, borderRadius: 12, border: `1px solid ${token.colorErrorBorder}` }}>
                        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
                          <div>
                            <Typography.Text strong style={{ display: "block" }}>Platformdan Çıkış Yap</Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: 13 }}>Giriş yapmak için e-posta ve şifrenizi tekrar girmeniz gerekecek.</Typography.Text>
                          </div>
                          
                          <Popconfirm
                            title="Oturumu kapatıyorsunuz"
                            description="Çıkış yapmak istediğinize emin misiniz?"
                            onConfirm={() => void logout()}
                            okText="Evet, Çıkış Yap"
                            cancelText="İptal"
                            okButtonProps={{ danger: true }}
                            placement="topRight"
                          >
                            <Button danger type="primary" size="large" icon={<LogOut size={16} />} style={{ borderRadius: 8 }}>
                              Çıkış Yap
                            </Button>
                          </Popconfirm>
                        </Flex>
                      </div>
                    </Flex>
                  </Card>
                </div>
              )
            }
          ]}
        />
      </Flex>
    </div>
  );
}
