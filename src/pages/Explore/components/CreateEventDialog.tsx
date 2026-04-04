import { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
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
} from "antd";
import type { CreateEventInput } from "@/features/events/types";

const eventCategories = ["Akademik", "Kariyer", "Sosyal", "Teknoloji", "Spor"];
type DateRange = [Dayjs, Dayjs];

interface CreateEventDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: CreateEventInput) => Promise<void>;
}

export default function CreateEventDialog({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateEventDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | null>(null);
  const [maxParticipants, setMaxParticipants] = useState<number>(100);
  const [category, setCategory] = useState(eventCategories[0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setLocation("");
      setDateRange(null);
      setMaxParticipants(100);
      setCategory(eventCategories[0]);
      setErrorMessage(null);
    }
  }, [isOpen]);

  async function handleOk() {
    if (title.trim().length < 3) {
      setErrorMessage("Etkinlik başlığı en az 3 karakter olmalı.");
      return;
    }
    if (description.trim().length < 10) {
      setErrorMessage("Açıklama en az 10 karakter olmalı.");
      return;
    }
    if (!location.trim()) {
      setErrorMessage("Konum alanı zorunludur.");
      return;
    }
    if (!maxParticipants || maxParticipants < 1 || maxParticipants > 5000) {
      setErrorMessage("Kontenjan 1 ile 5000 arasında olmalıdır.");
      return;
    }

    if (!dateRange) {
      setErrorMessage("Başlangıç ve bitiş tarihi seçilmelidir.");
      return;
    }

    const start = dateRange[0].toDate();
    const end = dateRange[1].toDate();

    if (end <= start) {
      setErrorMessage("Bitiş tarihi başlangıç tarihinden sonra olmalı.");
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
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Etkinlik oluşturulamadı.");
    }
  }

  return (
    <Modal
      title="Yeni Etkinlik Oluştur"
      open={isOpen}
      onCancel={onClose}
      footer={
        <Button type="primary" block loading={isSubmitting} onClick={handleOk}>
          {isSubmitting ? "Oluşturuluyor" : "Etkinliği Oluştur"}
        </Button>
      }
      destroyOnHidden
    >
      <Form layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item label="Başlık">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>
        <Form.Item label="Açıklama">
          <Input.TextArea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Konum">
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Tarih Aralığı">
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
                options={eventCategories.map((c) => ({ value: c, label: c }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Kontenjan">
              <InputNumber
                min={1}
                max={5000}
                value={maxParticipants}
                onChange={(val) => setMaxParticipants(val ?? 100)}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        {errorMessage && <Alert type="error" showIcon message={errorMessage} />}
      </Form>
    </Modal>
  );
}
