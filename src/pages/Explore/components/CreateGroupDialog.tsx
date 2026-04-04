import { useEffect, useState } from "react";
import { Alert, Button, Form, Input, Modal, Select } from "antd";

const groupCategories = ["Akademik", "Teknoloji", "Spor", "Sanat", "Sosyal"];

interface CreateGroupDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: { name: string; description: string; category: string }) => Promise<void>;
}

export default function CreateGroupDialog({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateGroupDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(groupCategories[0]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setDescription("");
      setCategory(groupCategories[0]);
      setErrorMessage(null);
    }
  }, [isOpen]);

  async function handleOk() {
    if (name.trim().length < 3) {
      setErrorMessage("Grup adı en az 3 karakter olmalı.");
      return;
    }
    if (description.trim().length < 10) {
      setErrorMessage("Açıklama en az 10 karakter olmalı.");
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit({ name: name.trim(), description: description.trim(), category });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Grup oluşturulamadı.");
    }
  }

  return (
    <Modal
      title="Yeni Grup Oluştur"
      open={isOpen}
      onCancel={onClose}
      footer={
        <Button type="primary" block loading={isSubmitting} onClick={handleOk}>
          {isSubmitting ? "Oluşturuluyor" : "Grubu Oluştur"}
        </Button>
      }
      destroyOnHidden
    >
      <Form layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item label="Grup Adı">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Açıklama">
          <Input.TextArea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Kategori">
          <Select
            value={category}
            onChange={setCategory}
            options={groupCategories.map((c) => ({ value: c, label: c }))}
          />
        </Form.Item>
        {errorMessage && <Alert type="error" showIcon message={errorMessage} />}
      </Form>
    </Modal>
  );
}
