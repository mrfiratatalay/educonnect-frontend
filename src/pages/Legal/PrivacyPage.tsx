import { Typography, Divider, Flex, Table } from "antd";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text, Link } = Typography;

const EFFECTIVE_DATE = "18 Nisan 2026";
const PLATFORM_NAME = "EduConnect";
const CONTACT_EMAIL = "firat_atalay21@erdogan.edu.tr";

const dataCategories = [
  {
    key: "1",
    category: "Kimlik",
    examples: "Ad, soyad",
    purpose: "Hesap oluşturma, profil",
    basis: "Açık rıza / Sözleşme",
    retention: "Hesap silinene kadar",
  },
  {
    key: "2",
    category: "İletişim",
    examples: "Üniversite e-posta adresi",
    purpose: "Doğrulama, bildirimler",
    basis: "Açık rıza / Sözleşme",
    retention: "Hesap silinene kadar",
  },
  {
    key: "3",
    category: "Akademik",
    examples: "Üniversite, bölüm, sınıf",
    purpose: "Profil, eşleştirme",
    basis: "Açık rıza",
    retention: "Hesap silinene kadar",
  },
  {
    key: "4",
    category: "Kullanım verisi",
    examples: "Gönderi, yorum, beğeni",
    purpose: "Platform işlevi, araştırma",
    basis: "Meşru menfaat / Açık rıza",
    retention: "30 gün (anonim) / hesap silinene kadar",
  },
  {
    key: "5",
    category: "Teknik",
    examples: "IP, tarayıcı, oturum",
    purpose: "Güvenlik, hata ayıklama",
    basis: "Meşru menfaat",
    retention: "90 gün",
  },
];

const columns = [
  { title: "Kategori", dataIndex: "category", key: "category", width: 110 },
  { title: "Örnekler", dataIndex: "examples", key: "examples" },
  { title: "İşleme Amacı", dataIndex: "purpose", key: "purpose" },
  { title: "Hukuki Dayanak", dataIndex: "basis", key: "basis" },
  { title: "Saklama Süresi", dataIndex: "retention", key: "retention" },
];

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <Flex
      vertical
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "40px 24px 80px",
      }}
    >
      <Flex align="center" gap={10} style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => navigate("/")}>
        <GraduationCap size={24} />
        <Text strong style={{ fontSize: 18 }}>{PLATFORM_NAME}</Text>
      </Flex>

      <Title level={1} style={{ marginTop: 24, marginBottom: 4 }}>Gizlilik Politikası</Title>
      <Text type="secondary">Son güncelleme: {EFFECTIVE_DATE}</Text>

      <Divider />

      <Paragraph>
        {PLATFORM_NAME}, kişisel verilerinizi 6698 sayılı <strong>Kişisel Verilerin Korunması Kanunu (KVKK)</strong> ve
        Avrupa Birliği <strong>Genel Veri Koruma Tüzüğü (GDPR)</strong> çerçevesinde işlemektedir.
        Bu Gizlilik Politikası; hangi verileri topladığımızı, neden topladığımızı, nasıl koruduğumuzu ve
        haklarınızı nasıl kullanabileceğinizi açıklamaktadır.
      </Paragraph>

      <Title level={3}>1. Veri Sorumlusu</Title>
      <Paragraph>
        Platform kapsamında veri sorumlusu sıfatını taşıyan araştırma ekibi aşağıdaki iletişim bilgileriyle ulaşılabilir durumdadır:
        <br />
        <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>
      </Paragraph>

      <Title level={3}>2. Toplanan Kişisel Veriler ve İşleme Amaçları</Title>
      <Paragraph>Aşağıdaki tablo, Platform'da işlenen kişisel verileri özetlemektedir:</Paragraph>

      <Table
        dataSource={dataCategories}
        columns={columns}
        pagination={false}
        size="small"
        scroll={{ x: true }}
        style={{ marginBottom: 24 }}
        bordered
      />

      <Title level={3}>3. Açık Rıza ve Onay</Title>
      <Paragraph>
        Platforma kayıt olurken kişisel verilerinizin yukarıda belirtilen amaçlar doğrultusunda işlenmesine
        <strong> açık rıza</strong> vermiş olursunuz. Rızanızı istediğiniz zaman geri alabilirsiniz; bu durumda
        hesabınız kapatılır ve verileriniz saklama süresi sonunda imha edilir.
      </Paragraph>
      <Paragraph>
        Araştırma amaçlı veri işleme yalnızca <strong>anonimleştirme</strong> sonrasında gerçekleştirilir;
        bireysel kullanıcılara atfedilemeyecek hale getirilen veriler akademik çalışmalarda kullanılabilir.
      </Paragraph>

      <Title level={3}>4. Çerezler (Cookies)</Title>
      <Paragraph>
        Platform yalnızca <strong>zorunlu oturum çerezleri</strong> kullanmaktadır. Bu çerezler oturum
        yönetimi için gereklidir ve kullanıcı reddedemez; ancak tarayıcınız üzerinden silebilirsiniz.
        Reklam, takip veya üçüncü taraf analitik çerezleri kullanılmamaktadır.
      </Paragraph>

      <Title level={3}>5. Üçüncü Taraflarla Veri Paylaşımı</Title>
      <Paragraph>
        Kişisel verileriniz; açık rızanız olmaksızın üçüncü taraflarla <strong>ticari amaçla paylaşılmaz</strong>.
        Veriler yalnızca şu durumlarda paylaşılabilir:
      </Paragraph>
      <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
        <li>Yasal zorunluluk (mahkeme kararı, resmi kurum talebi)</li>
        <li>Platform altyapısını sağlayan barındırma hizmetleri (yalnızca teknik erişim)</li>
        <li>Akademik yayınlar (yalnızca anonim, bireysel tanımlanamaz veriler)</li>
      </ul>

      <Title level={3}>6. Veri Güvenliği</Title>
      <Paragraph>
        Verilerinizi korumak için aşağıdaki teknik ve idari önlemler uygulanmaktadır:
      </Paragraph>
      <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
        <li>HTTPS ile şifreli iletişim</li>
        <li>Şifrelerin bcrypt algoritmasıyla hash'lenerek saklanması</li>
        <li>JWT tabanlı oturum yönetimi ve token sona erme süreleri</li>
        <li>Rol tabanlı erişim kontrolü (RBAC)</li>
        <li>Güvenlik açıklarının düzenli olarak izlenmesi</li>
      </ul>

      <Title level={3}>7. Verilerin Uluslararası Aktarımı</Title>
      <Paragraph>
        Verileriniz kural olarak Türkiye sınırları içinde işlenir ve saklanır. Barındırma altyapısının
        yurt dışı sunuculara ihtiyaç duyması halinde, KVKK madde 9 kapsamında yeterli koruma güvenceleri
        sağlanır ve bu durum kullanıcılara bildirilir.
      </Paragraph>

      <Title level={3}>8. KVKK ve GDPR Kapsamındaki Haklarınız</Title>
      <Paragraph>İlgili mevzuat kapsamında aşağıdaki haklara sahipsiniz:</Paragraph>
      <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
        <li><strong>Erişim:</strong> İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
        <li><strong>Düzeltme:</strong> Yanlış veya eksik verilerinizin güncellenmesini talep etme</li>
        <li><strong>Silme ("Unutulma Hakkı"):</strong> Verilerinizin silinmesini talep etme</li>
        <li><strong>İşlemenin Kısıtlanması:</strong> Belirli işleme faaliyetlerinin durdurulmasını talep etme</li>
        <li><strong>Veri Taşınabilirliği:</strong> Verilerinizi makine okunabilir formatta alma (GDPR md. 20)</li>
        <li><strong>İtiraz:</strong> Meşru menfaate dayalı işlemeye itiraz etme</li>
        <li><strong>Şikâyet:</strong> Kişisel Verileri Koruma Kurumu (KVKK) veya ilgili AB denetim makamına şikâyette bulunma</li>
      </ul>
      <Paragraph>
        Bu haklarınızı kullanmak için <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link> adresine
        yazılı başvuruda bulunabilirsiniz. Başvurularınız en geç 30 gün içinde yanıtlanır.
      </Paragraph>

      <Title level={3}>9. Çocukların Gizliliği</Title>
      <Paragraph>
        Platform yalnızca 18 yaş ve üzeri üniversite öğrencilerine yöneliktir. 18 yaşın altındaki kişilerin
        kayıt olması yasaktır. Bu durumu tespit ettiğimizde hesap kapatılır ve ilgili veriler derhal silinir.
      </Paragraph>

      <Title level={3}>10. Politika Güncellemeleri</Title>
      <Paragraph>
        Bu Politika zaman zaman güncellenebilir. Önemli değişiklikler hesabınıza kayıtlı e-posta adresinize
        bildirilir ve güncellenmiş sürüm bu sayfada yayımlanır. Değişikliğin ardından Platform'u kullanmaya
        devam etmeniz güncel Politikayı kabul ettiğiniz anlamına gelir.
      </Paragraph>

      <Title level={3}>11. İletişim</Title>
      <Paragraph>
        Gizlilik Politikamıza ilişkin sorularınız, haklarınızı kullanma talepleriniz veya veri ihlali
        bildirimleri için:{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>
      </Paragraph>
    </Flex>
  );
}
