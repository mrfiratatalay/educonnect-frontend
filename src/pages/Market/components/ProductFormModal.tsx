import { useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  message,
} from "antd";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useCategoriesQuery,
} from "@/features/products/hooks";
import type { CreateProductInput, ProductCondition, ProductResponse } from "@/features/products/types";

const conditionOptions: { label: string; value: ProductCondition }[] = [
  { label: "Sıfır", value: "new" },
  { label: "Yeni gibi", value: "likeNew" },
  { label: "İyi", value: "good" },
  { label: "Kullanılmış", value: "fair" },
];

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  product?: ProductResponse | null;
}

type FormValues = CreateProductInput & { imageUrlsRaw: string };

export default function ProductFormModal({ open, onClose, product }: ProductFormModalProps) {
  const isEdit = !!product;
  const [form] = Form.useForm<FormValues>();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const categoriesQuery = useCategoriesQuery();
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) return;
    if (product) {
      form.setFieldsValue({
        title: product.title,
        description: product.description,
        price: product.price,
        categoryId: product.categoryId ?? undefined,
        condition: product.condition,
        city: product.city,
        isNegotiable: product.isNegotiable,
        imageUrlsRaw: product.imageUrls.join("\n"),
      });
    } else {
      form.resetFields();
    }
  }, [open, product, form]);

  const handleFinish = async (values: FormValues) => {
    const imageUrls = values.imageUrlsRaw
      ? values.imageUrlsRaw.split("\n").map((u) => u.trim()).filter(Boolean)
      : [];

    const payload: CreateProductInput = {
      title: values.title,
      description: values.description,
      price: values.price,
      categoryId: values.categoryId,
      condition: values.condition,
      city: values.city,
      isNegotiable: values.isNegotiable ?? false,
      imageUrls,
    };

    try {
      if (isEdit && product) {
        await updateMutation.mutateAsync({ id: product.id, ...payload });
        message.success("İlan güncellendi!");
      } else {
        await createMutation.mutateAsync(payload);
        message.success("İlan başarıyla oluşturuldu!");
      }
      onClose();
    } catch {
      message.error(isEdit ? "Güncellenirken hata oluştu." : "Oluşturulurken hata oluştu.");
    }
  };

  const categoryOptions = (categoriesQuery.data ?? []).map((c) => ({
    label: c.name,
    value: c.id,
  }));

  return (
    <Modal
      title={isEdit ? "İlanı Düzenle" : "Yeni İlan Oluştur"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={isPending}
      okText={isEdit ? "Kaydet" : "Yayınla"}
      cancelText="Vazgeç"
      width={560}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ condition: "good", isNegotiable: false }}
        style={{ marginTop: 16 }}
      >
        <Form.Item name="title" label="Başlık"
          rules={[{ required: true, message: "Başlık zorunlu" }, { min: 3, message: "En az 3 karakter" }]}>
          <Input placeholder="Ürün başlığı" maxLength={200} />
        </Form.Item>

        <Form.Item name="description" label="Açıklama"
          rules={[{ required: true, message: "Açıklama zorunlu" }, { min: 10, message: "En az 10 karakter" }]}>
          <Input.TextArea rows={3} placeholder="Ürün açıklaması" maxLength={3000} />
        </Form.Item>

        <Form.Item name="price" label="Fiyat (TL)" rules={[{ required: true, message: "Fiyat zorunlu" }]}>
          <InputNumber min={0} max={10_000_000} style={{ width: "100%" }} placeholder="0"
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            parser={(v) => Number(v?.replace(/\./g, "") ?? 0) as 0} />
        </Form.Item>

        <Form.Item name="categoryId" label="Kategori">
          <Select placeholder="Kategori seçin" options={categoryOptions} allowClear loading={categoriesQuery.isLoading} />
        </Form.Item>

        <Form.Item name="condition" label="Ürün Durumu" rules={[{ required: true, message: "Durum zorunlu" }]}>
          <Select options={conditionOptions} />
        </Form.Item>

        <Form.Item name="city" label="Şehir" rules={[{ required: true, message: "Şehir zorunlu" }]}>
          <Input placeholder="Rize" maxLength={120} />
        </Form.Item>

        <Form.Item name="isNegotiable" label="Pazarlık Yapılır mı?" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item name="imageUrlsRaw" label="Görsel URL'leri (her satıra bir URL)">
          <Input.TextArea rows={3} placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
