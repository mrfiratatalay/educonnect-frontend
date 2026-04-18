import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Avatar, Button, Flex, Form, Input, Modal, Select, Spin, Typography, theme } from "antd";
import { Upload } from "lucide-react";
import type { CreateGroupInput } from "@/features/groups/types";
import { uploadGroupAvatar, uploadGroupBanner } from "@/features/groups/api";
import {
  avatarPresets,
  coverPresets,
  resolveGroupPresetUrl,
  type GroupVisualPreset,
} from "@/pages/Explore/components/groupVisualPresets";

const groupCategories = ["Akademik", "Teknoloji", "Spor", "Sanat", "Sosyal", "Kariyer"];

interface CreateGroupDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  initialValues?: Partial<CreateGroupInput>;
  submitLabel?: string;
  title?: string;
  onClose: () => void;
  onSubmit: (input: CreateGroupInput) => Promise<void>;
}

export default function CreateGroupDialog({
  isOpen,
  isSubmitting,
  initialValues,
  submitLabel = "Topluluğu oluştur",
  title = "Topluluk oluştur",
  onClose,
  onSubmit,
}: CreateGroupDialogProps) {
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState<string[]>(["", "", ""]);
  const [category, setCategory] = useState(groupCategories[0]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const { token } = theme.useToken();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(initialValues?.name ?? "");
    setShortDescription(initialValues?.shortDescription ?? "");
    setDescription(initialValues?.description ?? "");
    setRules(initialValues?.rules?.length ? [...initialValues.rules, "", "", ""].slice(0, 10) : ["", "", ""]);
    setCategory(initialValues?.category ?? groupCategories[0]);
    setAvatarUrl(initialValues?.avatarUrl ?? "");
    setBannerUrl(initialValues?.bannerUrl ?? "");
    setErrorMessage(null);
  }, [initialValues, isOpen]);

  const normalizedAvatarUrl = useMemo(() => normalizeOptionalUrl(avatarUrl), [avatarUrl]);
  const normalizedBannerUrl = useMemo(() => normalizeOptionalUrl(bannerUrl), [bannerUrl]);
  const resolvedAvatarPresets = useMemo(
    () => avatarPresets.map((preset) => ({ ...preset, url: resolveGroupPresetUrl(preset.path) })),
    [],
  );
  const resolvedCoverPresets = useMemo(
    () => coverPresets.map((preset) => ({ ...preset, url: resolveGroupPresetUrl(preset.path) })),
    [],
  );
  const previewDescription =
    shortDescription.trim() ||
    description.trim() ||
    "Topluluğun kisa açıklaması burada gorunecek.";

  async function handleBannerFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploadingBanner(true);
    setErrorMessage(null);
    try {
      const url = await uploadGroupBanner(file);
      setBannerUrl(url);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Kapak görseli yüklenemedi.");
    } finally {
      setIsUploadingBanner(false);
      if (bannerFileInputRef.current) bannerFileInputRef.current.value = "";
    }
  }

  async function handleAvatarFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    setErrorMessage(null);
    try {
      const url = await uploadGroupAvatar(file);
      setAvatarUrl(url);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Görsel yüklenemedi.");
    } finally {
      setIsUploadingAvatar(false);
      if (avatarFileInputRef.current) avatarFileInputRef.current.value = "";
    }
  }

  async function handleOk() {
    if (name.trim().length < 3) {
      setErrorMessage("Topluluk adi en az 3 karakter olmali.");
      return;
    }
    if (shortDescription.trim().length > 0 && shortDescription.trim().length < 3) {
      setErrorMessage("Kisa açıklama en az 3 karakter olmali.");
      return;
    }
    if (description.trim().length < 10) {
      setErrorMessage("Açıklama en az 10 karakter olmali.");
      return;
    }
    if (normalizedAvatarUrl && !isValidUrl(normalizedAvatarUrl)) {
      setErrorMessage("Profil görseli için gecerli bir URL gir.");
      return;
    }
    if (normalizedBannerUrl && !isValidUrl(normalizedBannerUrl)) {
      setErrorMessage("Kapak görseli için gecerli bir URL gir.");
      return;
    }

    const normalizedRules = rules
      .map((rule) => rule.trim())
      .filter((rule, index, array) => rule.length > 0 && array.indexOf(rule) === index)
      .slice(0, 10);

    try {
      setErrorMessage(null);
      await onSubmit({
        name: name.trim(),
        shortDescription: normalizeOptionalUrl(shortDescription),
        description: description.trim(),
        rules: normalizedRules,
        category,
        avatarUrl: normalizedAvatarUrl,
        bannerUrl: normalizedBannerUrl,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Topluluk oluşturulamadı.");
    }
  }

  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onClose}
      width={680}
      footer={
        <Button type="primary" block loading={isSubmitting} onClick={handleOk}>
          {isSubmitting ? "Kaydediliyor" : submitLabel}
        </Button>
      }
      destroyOnHidden
    >
      <Flex vertical gap={18} style={{ marginTop: 16 }}>
        <div
          style={{
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: 18,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 140,
              background: normalizedBannerUrl
                ? `url(${normalizedBannerUrl}) center / cover`
                : token.colorFillSecondary,
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              position: "relative",
              cursor: "pointer",
            }}
            onClick={() => bannerFileInputRef.current?.click()}
          >
            <input
              ref={bannerFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              style={{ display: "none" }}
              onChange={handleBannerFileChange}
            />
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "rgba(0,0,0,0.18)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              opacity: isUploadingBanner ? 1 : 0,
              transition: "opacity 0.18s",
            }}
              onMouseEnter={(e) => { if (!isUploadingBanner) (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}
              onMouseLeave={(e) => { if (!isUploadingBanner) (e.currentTarget as HTMLDivElement).style.opacity = "0"; }}
            >
              <Upload size={18} />
              {isUploadingBanner ? "Yükleniyor..." : "Kapak fotoğrafı ekle"}
            </div>
          </div>
          <Flex align="center" gap={14} style={{ padding: 16 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <input
                ref={avatarFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                style={{ display: "none" }}
                onChange={handleAvatarFileChange}
              />
              <Avatar
                size={64}
                src={normalizedAvatarUrl}
                style={{
                  background: token.colorFillSecondary,
                  color: token.colorText,
                  fontSize: 22,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
                onClick={() => avatarFileInputRef.current?.click()}
              >
                {isUploadingAvatar ? <Spin size="small" /> : (name.trim().charAt(0).toUpperCase() || "T")}
              </Avatar>
              <div
                onClick={() => avatarFileInputRef.current?.click()}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: token.colorPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: `2px solid ${token.colorBgContainer}`,
                }}
              >
                <Upload size={11} color="#fff" />
              </div>
            </div>
            <div style={{ minWidth: 0 }}>
              <Typography.Text strong style={{ display: "block", fontSize: 18 }}>
                {name.trim() || "Topluluk adi"}
              </Typography.Text>
              <Typography.Text type="secondary" style={{ display: "block", marginTop: 4 }}>
                {previewDescription}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                style={{ display: "block", marginTop: 6, fontSize: 13 }}
              >
                {category}
              </Typography.Text>
            </div>
          </Flex>
        </div>

        <Form layout="vertical">
          <Form.Item label="Topluluk adi">
            <Input
              maxLength={150}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Orn. Yapay Zeka Baronlari"
            />
          </Form.Item>

          <Form.Item
            label="Kisa açıklama"
            extra="Kartlarda ve ust bilgi alaninda gorunur. Bos birakirsan uzun açıklamadan turetilir."
          >
            <Input
              maxLength={220}
              value={shortDescription}
              onChange={(event) => setShortDescription(event.target.value)}
              placeholder="Topluluğunu tek cümlede anlat."
              showCount
            />
          </Form.Item>

          <Form.Item label="Açıklama">
            <Input.TextArea
              rows={4}
              maxLength={1000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Topluluğun amaci, kimler için oldugu ve ne paylaşilacagi."
              showCount
            />
          </Form.Item>

          <Form.Item
            label="Topluluk kurallari"
            extra="Bos satirlar kaydedilmez. En fazla 10 kural tutulur."
          >
            <Flex vertical gap={8}>
              {rules.map((rule, index) => (
                <Flex key={index} gap={8}>
                  <Input
                    value={rule}
                    maxLength={140}
                    onChange={(event) =>
                      setRules((currentRules) =>
                        currentRules.map((currentRule, currentIndex) =>
                          currentIndex === index ? event.target.value : currentRule,
                        ),
                      )
                    }
                    placeholder={`Kural ${index + 1}`}
                  />
                  {rules.length > 1 ? (
                    <Button
                      onClick={() =>
                        setRules((currentRules) => currentRules.filter((_, currentIndex) => currentIndex !== index))
                      }
                    >
                      Sil
                    </Button>
                  ) : null}
                </Flex>
              ))}
              {rules.length < 10 ? (
                <Button
                  type="dashed"
                  onClick={() => setRules((currentRules) => [...currentRules, ""])}
                >
                  Kural ekle
                </Button>
              ) : null}
            </Flex>
          </Form.Item>

          <Form.Item label="Kategori">
            <Select
              value={category}
              onChange={setCategory}
              options={groupCategories.map((item) => ({ value: item, label: item }))}
            />
          </Form.Item>

          <Form.Item
            label="Hazır profil görselleri"
            extra="Bir preset sec veya alttan kendi URL'ni gir."
          >
            <Flex gap={12} wrap="wrap">
              {resolvedAvatarPresets.map((preset) => (
                <AvatarPresetButton
                  key={preset.id}
                  preset={preset}
                  isSelected={normalizedAvatarUrl === preset.url}
                  onSelect={() => setAvatarUrl(preset.url)}
                />
              ))}
            </Flex>
          </Form.Item>

          <Form.Item
            label="Profil görseli URL"
            extra="Hazır seçimi degistirmek istersen kendi URL'ni kullanabilirsin."
          >
            <Input
              value={avatarUrl}
              onChange={(event) => setAvatarUrl(event.target.value)}
              placeholder="https://..."
            />
          </Form.Item>

          <Form.Item
            label="Hazır kapaklar"
            extra="Detay sayfasındaki ust kapak alani için hizli seçim."
          >
            <Flex vertical gap={12}>
              {resolvedCoverPresets.map((preset) => (
                <CoverPresetButton
                  key={preset.id}
                  preset={preset}
                  isSelected={normalizedBannerUrl === preset.url}
                  onSelect={() => setBannerUrl(preset.url)}
                />
              ))}
            </Flex>
          </Form.Item>

          <Form.Item
            label="Kapak görseli URL"
            extra="Istersen hazır seçim yerine kendi kapak URL'ni kullan."
          >
            <Input
              value={bannerUrl}
              onChange={(event) => setBannerUrl(event.target.value)}
              placeholder="https://..."
            />
          </Form.Item>

          {errorMessage ? <Alert type="error" showIcon message={errorMessage} /> : null}
        </Form>
      </Flex>
    </Modal>
  );
}

function AvatarPresetButton({
  preset,
  isSelected,
  onSelect,
}: {
  preset: GroupVisualPreset & { url: string };
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { token } = theme.useToken();

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        border: `2px solid ${isSelected ? token.colorPrimary : token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        borderRadius: 18,
        padding: 10,
        width: 92,
        cursor: "pointer",
      }}
    >
      <Flex vertical align="center" gap={8}>
        <Avatar size={52} src={preset.url}>
          {preset.label.charAt(0)}
        </Avatar>
        <Typography.Text style={{ fontSize: 12, fontWeight: isSelected ? 700 : 500 }}>
          {preset.label}
        </Typography.Text>
      </Flex>
    </button>
  );
}

function CoverPresetButton({
  preset,
  isSelected,
  onSelect,
}: {
  preset: GroupVisualPreset & { url: string };
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { token } = theme.useToken();

  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        border: `2px solid ${isSelected ? token.colorPrimary : token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        borderRadius: 18,
        padding: 8,
        width: "100%",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <Flex vertical gap={8}>
        <div
          style={{
            height: 96,
            borderRadius: 12,
            background: `url(${preset.url}) center / cover`,
          }}
        />
        <Typography.Text style={{ fontSize: 13, fontWeight: isSelected ? 700 : 500 }}>
          {preset.label}
        </Typography.Text>
      </Flex>
    </button>
  );
}

function normalizeOptionalUrl(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
