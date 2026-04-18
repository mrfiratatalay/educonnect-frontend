import { useEffect, useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import {
  Alert,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Skeleton,
} from "antd";
import { useJoinedGroupsQuery } from "@/features/groups/hooks";
import type { AppEvent, CreateEventInput } from "@/features/events/types";

const eventCategories = ["Akademik", "Kariyer", "Sosyal", "Teknoloji", "Spor"];
type DateRange = [Dayjs, Dayjs];

interface CreateEventDialogProps {
  event?: AppEvent | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: CreateEventInput) => Promise<void>;
}

export default function CreateEventDialog({
  event,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateEventDialogProps) {
  const joinedGroupsQuery = useJoinedGroupsQuery(50, isOpen);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [maxParticipants, setMaxParticipants] = useState<number>(100);
  const [category, setCategory] = useState(eventCategories[0]);
  const [groupId, setGroupId] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage(null);
      return;
    }

    setTitle(event?.title ?? "");
    setDescription(event?.description ?? "");
    setLocation(event?.location ?? "");
    setDateRange(
      event
        ? [dayjs(event.startDate), dayjs(event.endDate)]
        : null,
    );
    setMaxParticipants(event?.maxParticipants ?? 100);
    setCategory(event?.category ?? eventCategories[0]);
    setGroupId(event?.groupId);
    setErrorMessage(null);
  }, [event, isOpen]);

  const groupOptions = useMemo(
    () => [
      { value: "__none__", label: "Grupsuz etkinlik" },
      ...(joinedGroupsQuery.data ?? []).map((group) => ({
        value: group.id,
        label: group.name,
      })),
    ],
    [joinedGroupsQuery.data],
  );

  async function handleOk() {
    if (title.trim().length < 3) {
      setErrorMessage("Etkinlik basligi en az 3 karakter olmali.");
      return;
    }

    if (description.trim().length < 10) {
      setErrorMessage("Aciklama en az 10 karakter olmali.");
      return;
    }

    if (!location.trim()) {
      setErrorMessage("Konum alani zorunludur.");
      return;
    }

    if (!maxParticipants || maxParticipants < 1 || maxParticipants > 5000) {
      setErrorMessage("Kontenjan 1 ile 5000 arasinda olmalidir.");
      return;
    }

    if (!dateRange) {
      setErrorMessage("Baslangic ve bitis tarihi secilmelidir.");
      return;
    }

    const start = dateRange[0].toDate();
    const end = dateRange[1].toDate();

    if (end <= start) {
      setErrorMessage("Bitis tarihi baslangic tarihinden sonra olmali.");
      return;
    }

    if (start <= new Date()) {
      setErrorMessage("Etkinlik baslangic tarihi gelecekte olmali.");
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        startDateUtc: start.toISOString(),
        endDateUtc: end.toISOString(),
        maxParticipants,
        category,
        groupId: groupId || undefined,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Etkinlik olusturulamadi.");
    }
  }

  return (
    <Modal
      title={event ? "Etkinligi Duzenle" : "Yeni Etkinlik Olustur"}
      open={isOpen}
      onCancel={onClose}
      footer={
        <Button type="primary" block loading={isSubmitting} onClick={handleOk}>
          {isSubmitting
            ? event
              ? "Guncelleniyor"
              : "Olusturuluyor"
            : event
              ? "Etkinligi Guncelle"
              : "Etkinligi Olustur"}
        </Button>
      }
      destroyOnHidden
    >
      <Form layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item label="Baslik">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>
        <Form.Item label="Aciklama">
          <Input.TextArea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Konum">
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </Form.Item>
        <Form.Item label="Bagli Grup">
          {joinedGroupsQuery.isLoading ? (
            <Skeleton.Input active block />
          ) : (
            <Select
              value={groupId ?? "__none__"}
              onChange={(value) => setGroupId(value === "__none__" ? undefined : value)}
              options={groupOptions}
            />
          )}
        </Form.Item>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Tarih Araligi">
              <DatePicker.RangePicker
                showTime={{ format: "HH:mm" }}
                style={{ width: "100%" }}
                value={dateRange}
                format="DD.MM.YYYY HH:mm"
                onChange={(value) => setDateRange(value as DateRange | null)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Kategori">
              <Select
                value={category}
                onChange={setCategory}
                options={eventCategories.map((item) => ({ value: item, label: item }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kontenjan">
              <InputNumber
                min={1}
                max={5000}
                value={maxParticipants}
                onChange={(value) => setMaxParticipants(value ?? 100)}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        {errorMessage ? <Alert type="error" showIcon message={errorMessage} /> : null}
      </Form>
    </Modal>
  );
}
