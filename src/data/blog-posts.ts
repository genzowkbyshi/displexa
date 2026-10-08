export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  featured: boolean;
}

export const BLOG_ARTICLES: BlogPost[] = [
  {
    slug: "qr-menu-ile-restoran-maliyetlerini-dusurmenin-5-yolu",
    title: "QR Menü ile Restoran Maliyetlerini Düşürmenin 5 Yolu",
    category: "Maliyet & Verimlilik",
    date: "8 Ekim 2026",
    readTime: "4 dk okuma",
    image: "/images/blog1.png",
    excerpt:
      "Her fiyat değişiminde matbaaya binlerce lira ödemeye son verin. Dijital menülerin kağıt, personel ve operasyonel giderleri nasıl azalttığını keşfedin.",
    featured: true,
  },
  {
    slug: "menu-muhendisligi-nedir-ve-satislari-nasil-artirir",
    title: "Menü Mühendisliği Nedir ve Satışları Nasıl Artırır?",
    category: "Menü Mühendisliği",
    date: "5 Ekim 2026",
    readTime: "6 dk okuma",
    image: "/images/blog2.png",
    excerpt:
      "Müşterilerinizin göz hareketlerine göre en karlı yemeklerinizi öne çıkarın. Psikolojik fiyatlandırma ve menü yerleşim stratejileri rehberi.",
    featured: false,
  },
  {
    slug: "restoranlarda-coklu-dil-destegi-turist-musterileri-nasil-ceker",
    title: "Restoranlarda Çoklu Dil Desteği: Turist Müşterileri Nasıl Çeker?",
    category: "Dijitalleşme",
    date: "1 Ekim 2026",
    readTime: "5 dk okuma",
    image: "/images/blog3.png",
    excerpt:
      "Dil bariyerini ortadan kaldırarak yabancı misafirlerinize kendi dillerinde sipariş verme imkanı sağlayın ve bahşiş oranlarınızı yükseltin.",
    featured: false,
  },
  {
    slug: "hijyenik-ve-temassiz-siparis-deneyimi-neden-onemli",
    title: "Hijyenik ve Temassız Menü Deneyimi Müşteri Sadakatini Nasıl Etkiler?",
    category: "Restoran Yönetimi",
    date: "26 Eylül 2026",
    readTime: "3 dk okuma",
    image: "/images/blog1.png",
    excerpt:
      "Masadan masaya gezen yıpranmış menüler yerine modern QR menü kullanımı müşterilere güven aşılar ve mekanınızın prestijini artırır.",
    featured: false,
  },
  {
    slug: "restoran-fotografciligi-istah-acici-gorseller-ile-ciroyu-artirin",
    title: "Restoran Fotoğrafçılığı: İştah Açıcı Görseller ile Ciroyu Artırın",
    category: "Menü Mühendisliği",
    date: "20 Eylül 2026",
    readTime: "5 dk okuma",
    image: "/images/blog2.png",
    excerpt:
      "Bir resim bin kelimeye bedeldir. Kaliteli ürün fotoğraflarının yan ürün ve tatlı satışlarına olan doğrudan etkisini araştırdık.",
    featured: false,
  },
  {
    slug: "2027-restoran-trendleri-dijital-donusum-nereye-gidiyor",
    title: "Geleceğin Restoran Trendleri: Dijital Dönüşüm Nereye Gidiyor?",
    category: "Dijitalleşme",
    date: "15 Eylül 2026",
    readTime: "7 dk okuma",
    image: "/images/blog3.png",
    excerpt:
      "Yapay zeka öneri sistemleri, dinamik fiyatlandırma ve kişiselleştirilmiş menü deneyimleriyle restoran sektörünün geleceği şekilleniyor.",
    featured: false,
  },
];
