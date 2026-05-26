import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Camera, X } from "lucide-react";
import {
  Avatar,
  Button,
  Flex,
  Form,
  Grid,
  Input,
  Modal,
  Select,
  Typography,
  Upload,
  message,
  theme,
} from "antd";
import type { UploadProps } from "antd";
import { getApiErrorMessage, getUniversities } from "@/features/auth/api";
import {
  useUpdateMyProfileMutation,
  useUploadMyAvatarMutation,
  useUploadMyCoverMutation,
} from "@/features/users/hooks";

const profileEditSchema = z.object({
  fullName: z.string().min(3, "Ad soyad en az 3 karakter olmalı"),
  universityId: z.string().min(1, "Üniversite seçiniz"),
  department: z.string().min(2, "Bölüm en az 2 karakter olmalı"),
  year: z.string().min(1, "Sinif seçiniz"),
  bio: z.string().max(500, "Biyografi en fazla 500 karakter olabilir").optional(),
});

type ProfileEditForm = z.infer<typeof profileEditSchema>;

interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
  profile: {
    fullName: string;
    avatarUrl?: string;
    coverImageUrl?: string;
    bio?: string;
    universityId?: string;
    universityName?: string;
    department?: string;
    year?: number;
    email?: string;
  };
}

export default function ProfileEditModal({
  open,
  onClose,
  profile,
}: ProfileEditModalProps) {
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const updateProfileMutation = useUpdateMyProfileMutation();
  const uploadAvatarMutation = useUploadMyAvatarMutation();
  const uploadCoverMutation = useUploadMyCoverMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const { data: universities = [], isLoading: isUniversitiesLoading } = useQuery({
    queryKey: ["universities"],
    queryFn: getUniversities,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileEditForm>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      fullName: "",
      universityId: "",
      department: "",
      year: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    setSubmitError(null);
    reset({
      fullName: profile.fullName,
      universityId: profile.universityId || "",
      department: profile.department || "",
      year: profile.year ? String(profile.year) : "",
      bio: profile.bio || "",
    });
  }, [open, profile, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (submittingRef.current) return; // Double-click koruyucusu.
    submittingRef.current = true;
    setSubmitError(null);

    try {
      await updateProfileMutation.mutateAsync({
        fullName: data.fullName,
        universityId: data.universityId,
        department: data.department,
        year: Number(data.year),
        bio: data.bio?.trim() || undefined,
      });

      message.success("Profil güncellendi.");
      onClose();
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    } finally {
      submittingRef.current = false;
    }
  });

  const avatarUploadProps: UploadProps = {
    name: "file",
    showUploadList: false,
    accept: "image/png,image/jpeg,image/gif",
    beforeUpload: (file) => {
      const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

      if (!allowedTypes.includes(file.type)) {
        setSubmitError("Sadece JPG, PNG veya GIF dosyalari yükleyebilirsiniz.");
        return Upload.LIST_IGNORE;
      }

      if (file.size / 1024 / 1024 >= 5) {
        setSubmitError("Profil fotoğrafı en fazla 5MB olabilir.");
        return Upload.LIST_IGNORE;
      }

      setSubmitError(null);
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        await uploadAvatarMutation.mutateAsync(file as File);
        onSuccess?.("ok");
        message.success("Profil fotoğrafı güncellendi.");
      } catch (error) {
        onError?.(error as Error);
        setSubmitError(getApiErrorMessage(error));
      }
    },
  };

  const coverUploadProps: UploadProps = {
    name: "file",
    showUploadList: false,
    accept: "image/png,image/jpeg,image/gif",
    beforeUpload: (file) => {
      const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

      if (!allowedTypes.includes(file.type)) {
        setSubmitError("Sadece JPG, PNG veya GIF dosyalari yükleyebilirsiniz.");
        return Upload.LIST_IGNORE;
      }

      if (file.size / 1024 / 1024 >= 5) {
        setSubmitError("Kapak fotoğrafı en fazla 5MB olabilir.");
        return Upload.LIST_IGNORE;
      }

      setSubmitError(null);
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        await uploadCoverMutation.mutateAsync(file as File);
        onSuccess?.("ok");
        message.success("Kapak fotoğrafı güncellendi.");
      } catch (error) {
        onError?.(error as Error);
        setSubmitError(getApiErrorMessage(error));
      }
    },
  };

  const coverPlaceholderColor = token.colorBorderSecondary;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closeIcon={false}
      destroyOnHidden
      forceRender
      zIndex={1100}
      width={screens.md ? 620 : "100%"}
      wrapClassName="profile-edit-modal"
      style={{ top: screens.md ? 24 : 0 }}
      styles={{
        mask: {
          background: "rgba(0, 0, 0, 0.56)",
        },
        body: {
          padding: 0,
          maxHeight: screens.md ? "calc(100vh - 80px)" : "100dvh",
          overflowY: "auto",
        },
      }}
      title={
        <Flex align="center" justify="space-between" gap={12}>
          <Flex align="center" gap={8}>
            <Button
              type="text"
              shape="circle"
              aria-label="Profili düzenlemeyi kapat"
              onClick={onClose}
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <X size={20} />
            </Button>
            <Typography.Title level={4} style={{ margin: 0, fontWeight: 800 }}>
              Profili düzenle
            </Typography.Title>
          </Flex>

          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            form="profile-edit-form"
            loading={updateProfileMutation.isPending}
          >
            Kaydet
          </Button>
        </Flex>
      }
    >
      <Upload
        {...coverUploadProps}
        className="profile-edit-modal-cover-upload"
        disabled={uploadCoverMutation.isPending}
        styles={{
          root: {
            display: "block",
            width: "100%",
          },
          trigger: {
            display: "block",
            width: "100%",
          },
        }}
      >
        <div
          style={{
            width: "100%",
            height: screens.sm ? 220 : 180,
            backgroundColor: coverPlaceholderColor,
            backgroundImage: profile.coverImageUrl ? `url(${profile.coverImageUrl})` : undefined,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            cursor: "pointer",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: profile.coverImageUrl ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "rgba(15, 20, 25, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Camera size={20} color="#fff" />
            </div>
            <Typography.Text
              style={{
                color: profile.coverImageUrl ? "#fff" : token.colorText,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {uploadCoverMutation.isPending ? "Kapak yükleniyor..." : "Kapak fotoğrafı ekle"}
            </Typography.Text>
          </div>
        </div>
      </Upload>

      <div style={{ padding: "0 20px 24px" }}>
        <Flex align="flex-end" justify="space-between" gap={16} wrap="wrap" style={{ marginTop: -48 }}>
          <Upload {...avatarUploadProps} disabled={uploadAvatarMutation.isPending}>
            <div
              style={{
                position: "relative",
                cursor: "pointer",
                width: 96,
                height: 96,
              }}
            >
              <Avatar
                size={96}
                src={profile.avatarUrl}
                style={{
                  backgroundColor: token.colorPrimary,
                  color: token.colorTextLightSolid,
                  border: `4px solid ${token.colorBgContainer}`,
                }}
              >
                {profile.fullName.charAt(0)}
              </Avatar>

              <div
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 2,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: token.colorBgContainer,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: token.boxShadowSecondary,
                }}
              >
                <Camera size={16} />
              </div>
            </div>
          </Upload>
        </Flex>

        <Typography.Text
          type="secondary"
          style={{ display: "block", marginTop: 12, fontSize: 13 }}
        >
          Profil ve kapak fotoğrafı için JPG, GIF veya PNG. Maksimum 5MB.
        </Typography.Text>

        <Form
          id="profile-edit-form"
          layout="vertical"
          requiredMark={false}
          onFinish={onSubmit}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label={<Typography.Text strong>Isim</Typography.Text>}
            validateStatus={errors.fullName ? "error" : undefined}
            help={errors.fullName?.message}
          >
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => <Input {...field} size="large" />}
            />
          </Form.Item>

          <Form.Item
            label={<Typography.Text strong>Kişisel bilgiler</Typography.Text>}
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
                  maxLength={500}
                  showCount
                  autoSize={{ minRows: 4, maxRows: 7 }}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label={<Typography.Text strong>Üniversite</Typography.Text>}
            validateStatus={errors.universityId ? "error" : undefined}
            help={errors.universityId?.message}
          >
            <Controller
              name="universityId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  size="large"
                  loading={isUniversitiesLoading}
                  placeholder="Üniversite seçiniz"
                  options={universities.map((university) => ({
                    value: university.id,
                    label: university.name,
                  }))}
                />
              )}
            />
          </Form.Item>

          <Flex gap={16} wrap="wrap">
            <Form.Item
              label={<Typography.Text strong>Bölüm</Typography.Text>}
              validateStatus={errors.department ? "error" : undefined}
              help={errors.department?.message}
              style={{ flex: "1 1 240px", marginBottom: 0 }}
            >
              <Controller
                name="department"
                control={control}
                render={({ field }) => <Input {...field} size="large" />}
              />
            </Form.Item>

            <Form.Item
              label={<Typography.Text strong>Sinif</Typography.Text>}
              validateStatus={errors.year ? "error" : undefined}
              help={errors.year?.message}
              style={{ flex: "1 1 160px", marginBottom: 0 }}
            >
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="large"
                    placeholder="Seçiniz"
                    options={Array.from({ length: 4 }, (_, index) => ({
                      value: String(index + 1),
                      label: `${index + 1}. sinif`,
                    }))}
                  />
                )}
              />
            </Form.Item>
          </Flex>

          {submitError ? (
            <Typography.Text
              style={{
                display: "block",
                marginTop: 16,
                color: token.colorError,
                fontSize: 13,
              }}
            >
              {submitError}
            </Typography.Text>
          ) : null}
        </Form>
      </div>
    </Modal>
  );
}
