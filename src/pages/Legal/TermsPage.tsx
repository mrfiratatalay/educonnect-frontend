import { Typography, Divider, Flex } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text, Link } = Typography;

const EFFECTIVE_DATE = "18 Nisan 2026";
const PLATFORM_NAME = "EduConnect";
const CONTACT_EMAIL = "firat_atalay21@erdogan.edu.tr";

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <Flex
      vertical
      style={{
        maxWidth: 780,
        margin: "0 auto",
        padding: "40px 24px 80px",
      }}
    >
      <Flex align="center" gap={10} style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => navigate("/")}>
        <img src="/logo.png" alt="EduConnect" style={{ width: 64, height: 64, objectFit: "contain" }} />
        <Text strong style={{ fontSize: 18 }}>{PLATFORM_NAME}</Text>
      </Flex>

      <Title level={1} style={{ marginTop: 24, marginBottom: 4 }}>Hizmet Şartları</Title>
      <Text type="secondary">Son güncelleme: {EFFECTIVE_DATE}</Text>

      <Divider />

      <Paragraph>
        Bu Hizmet Şartları ("Şartlar"), {PLATFORM_NAME} platformunu ("Platform") kullanan bireyler ("Kullanıcı") ile
        Platform'u işleten araştırma ekibi ("Biz") arasındaki hukuki ilişkiyi düzenler.
        Platform'a erişerek veya hesap oluşturarak bu Şartları okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz.
      </Paragraph>

      <Title level={3}>1. Platformun Amacı ve Kapsamı</Title>
      <Paragraph>
        {PLATFORM_NAME}, üniversite öğrencilerinin akademik ve sosyal etkileşimini desteklemek amacıyla yürütülen
        bir TÜBİTAK destekli araştırma projesi kapsamında geliştirilmiş bir prototip platformdur.
        Platform; gönderi paylaşımı, topluluk oluşturma, etkinlik takibi, yapay zeka destekli akademik asistan ve
        öğrenci pazarı gibi özellikler sunmaktadır.
      </Paragraph>
      <Paragraph>
        Platform, ticari amaçla işletilmemekte olup yalnızca akademik araştırma ve prototipleme süreçlerinde kullanılmaktadır.
      </Paragraph>

      <Title level={3}>2. Hesap Oluşturma ve Kimlik Doğrulama</Title>
      <Paragraph>
        Platforma kayıt olabilmek için geçerli bir kurumsal üniversite e-posta adresi (<Text code>@üniversite.edu.tr</Text> uzantılı)
        kullanmanız zorunludur. Kayıt sırasında e-posta adresinize gönderilen 6 haneli doğrulama kodu ile kimliğinizi
        onaylamanız gerekmektedir.
      </Paragraph>
      <Paragraph>
        Hesap güvenliğinden tamamen siz sorumlusunuz. Şifrenizi kimseyle paylaşmamalı; hesabınızda yetkisiz bir
        erişim tespit ettiğinizde derhal bize bildirmelisiniz.
      </Paragraph>

      <Title level={3}>3. Kullanıcı Yükümlülükleri ve Yasaklı İçerikler</Title>
      <Paragraph>Platform'u kullanırken aşağıdaki kurallara uymayı kabul edersiniz:</Paragraph>
      <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
        <li>Gerçek ve doğru bilgilerle kayıt olmak</li>
        <li>Başkalarının kişisel verilerini izinsiz paylaşmamak</li>
        <li>Hakaret, nefret söylemi, tehdit veya taciz içeren içerik yayınlamamak</li>
        <li>Telif hakkı ihlali oluşturan içerik paylaşmamak</li>
        <li>Platform'u spam, kötü amaçlı yazılım veya dolandırıcılık amacıyla kullanmamak</li>
        <li>Otomatik botlar veya scriptler aracılığıyla işlem yapmamak</li>
        <li>Sistemi aşırı yükleyecek veya güvenliğini tehdit edecek faaliyetlerde bulunmamak</li>
      </ul>

      <Title level={3}>4. İçerik ve Fikri Mülkiyet</Title>
      <Paragraph>
        Platform üzerinde paylaştığınız tüm içerikler (metin, görsel, yorum vb.) size ait olmaya devam eder.
        Bununla birlikte, içeriği Platform'a yükleyerek; söz konusu içeriğin araştırma kapsamında analiz edilmesine,
        anonimleştirilerek akademik yayınlarda kullanılmasına ve Platform işlevlerinin sağlanması için işlenmesine
        izin vermiş olursunuz.
      </Paragraph>
      <Paragraph>
        Platform'un tasarımı, arayüzü ve özgün yazılım kodu üzerindeki tüm haklar araştırma ekibine aittir.
      </Paragraph>

      <Title level={3}>5. Gizlilik ve Kişisel Veri İşleme</Title>
      <Paragraph>
        Kişisel verilerinizin nasıl toplandığı, işlendiği ve korunduğuna ilişkin ayrıntılı bilgi için{" "}
        <Link href="/privacy" target="_blank">Gizlilik Politikamızı</Link> inceleyiniz.
        Platform, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve Avrupa Birliği Genel Veri Koruma
        Tüzüğü (GDPR) kapsamında veri işlemektedir.
      </Paragraph>

      <Title level={3}>6. Platformun Erişilebilirliği</Title>
      <Paragraph>
        Platform, araştırma projesi kapsamında sunulmakta olup kesintisiz hizmet garantisi verilmemektedir.
        Bakım, güncelleme veya teknik gereklilikler nedeniyle önceden bildirim yapılmaksızın erişim geçici olarak kısıtlanabilir.
      </Paragraph>

      <Title level={3}>7. Hesap Askıya Alma ve Kapatma</Title>
      <Paragraph>
        Bu Şartları ihlal ettiğiniz tespit edildiğinde, önceden bildirim yapılmaksızın hesabınız geçici olarak
        askıya alınabilir ya da kalıcı olarak kapatılabilir. Hesabınızın kapatılmasını talep etme hakkınız her
        zaman saklıdır; bu durumda kişisel verileriniz Gizlilik Politikası'nda belirtilen süreler dahilinde silinir.
      </Paragraph>

      <Title level={3}>8. Sorumluluk Sınırlaması</Title>
      <Paragraph>
        Platform bir araştırma prototipi olduğundan, üçüncü taraf içeriklerinden, kullanıcı hatalarından veya
        hizmet kesintilerinden kaynaklanabilecek doğrudan ya da dolaylı zararlardan araştırma ekibi sorumlu tutulamaz.
      </Paragraph>

      <Title level={3}>9. Şartlarda Değişiklik</Title>
      <Paragraph>
        Bu Şartlar zaman zaman güncellenebilir. Önemli değişiklikler Platform üzerinden duyurulacak ve
        güncellenmiş sürüm bu sayfada yayımlanacaktır. Değişikliğin ardından Platform'u kullanmaya devam etmeniz,
        güncel Şartları kabul ettiğiniz anlamına gelir.
      </Paragraph>

      <Title level={3}>10. Uygulanacak Hukuk</Title>
      <Paragraph>
        Bu Şartlar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda yetkili mahkeme İstanbul Mahkemeleri'dir.
      </Paragraph>

      <Title level={3}>11. İletişim</Title>
      <Paragraph>
        Bu Şartlara ilişkin sorularınız için{" "}
        <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link> adresine yazabilirsiniz.
      </Paragraph>
    </Flex>
  );
}
