export type QuizTopic =
  | 'Unsur Seni Rupa'
  | 'Garis, Bentuk, Warna, Tekstur & Ruang'
  | 'Prinsip Seni Rupa'
  | 'Seni Rupa 2D & 3D';

export type VisualCue =
  | 'titik'
  | 'unsur-umum'
  | 'gelap-terang'
  | 'bidang'
  | 'ruang-perspektif'
  | 'garis-ekspresif'
  | 'bentuk-organis'
  | 'warna-primer'
  | 'tekstur'
  | 'warna-komplementer'
  | 'keseimbangan'
  | 'kesatuan'
  | 'irama'
  | 'proporsi'
  | 'pusat-perhatian'
  | 'karya-2d'
  | 'karya-3d'
  | 'teknik-3d'
  | 'relief'
  | 'anyaman';

export interface QuizQuestion {
  id: number;
  topic: QuizTopic;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
  visualCue: VisualCue;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Topik 1: Unsur Seni Rupa (Soal 1–5)
  {
    id: 1,
    topic: 'Unsur Seni Rupa',
    question: 'Unsur seni rupa yang paling dasar dan menjadi awal terbentuknya garis serta bidang adalah...',
    options: ['Titik', 'Warna', 'Tekstur', 'Ruang'],
    correctIndex: 0,
    explanation: 'Titik adalah unsur seni rupa paling dasar (terkecil). Kumpulan titik yang berdekatan akan membentuk garis, lalu berkembang menjadi bidang dan bentuk.',
    visualCue: 'titik',
  },
  {
    id: 2,
    topic: 'Unsur Seni Rupa',
    question: 'Berikut ini yang BUKAN termasuk unsur-unsur dasar seni rupa adalah...',
    options: ['Garis dan bidang', 'Warna dan tekstur', 'Irama dan keseimbangan', 'Titik dan ruang'],
    correctIndex: 2,
    explanation: 'Irama dan keseimbangan termasuk PRINSIP seni rupa (cara menyusun unsur), sedangkan titik, garis, bidang, bentuk, ruang, warna, dan tekstur adalah UNSUR seni rupa.',
    visualCue: 'unsur-umum',
  },
  {
    id: 3,
    topic: 'Unsur Seni Rupa',
    question: 'Unsur gelap terang dalam sebuah gambar buah apel berfungsi untuk memberikan kesan...',
    options: ['Datar dan kaku', 'Volume atau tiga dimensi pada benda', 'Permukaan selalu licin', 'Warna menjadi pudar'],
    correctIndex: 1,
    explanation: 'Gelap terang (value) muncul karena perbedaan cahaya yang jatuh pada benda. Unsur ini membuat gambar terlihat bervolume dan tampak nyata seperti 3D.',
    visualCue: 'gelap-terang',
  },
  {
    id: 4,
    topic: 'Unsur Seni Rupa',
    question: 'Pertemuan antara beberapa garis yang ujung dan pangkalnya saling terhubung membentuk area tertutup disebut...',
    options: ['Titik', 'Bidang', 'Tekstur', 'Gelap terang'],
    correctIndex: 1,
    explanation: 'Bidang terbentuk ketika garis-garis saling bertemu membentuk area datar dua dimensi (memiliki panjang dan lebar), seperti persegi, segitiga, atau lingkaran.',
    visualCue: 'bidang',
  },
  {
    id: 5,
    topic: 'Unsur Seni Rupa',
    question: 'Pada gambar pemandangan jalan raya yang tampak semakin mengecil di kejauhan, pelukis sedang menerapkan unsur...',
    options: ['Tekstur semu', 'Ruang dan perspektif', 'Warna primer', 'Garis zig-zag'],
    correctIndex: 1,
    explanation: 'Kesan jauh-dekat dan kedalaman pada bidang gambar datar diciptakan melalui unsur ruang (ruang semu) dengan bantuan teknik perspektif.',
    visualCue: 'ruang-perspektif',
  },

  // Topik 2: Garis, Bentuk, Warna, Tekstur & Ruang (Soal 6–10)
  {
    id: 6,
    topic: 'Garis, Bentuk, Warna, Tekstur & Ruang',
    question: 'Garis lengkung atau bergelombang dalam gambar ombak laut biasanya memberikan kesan...',
    options: ['Tegas, kaku, dan diam', 'Luwes, lembut, dan bergerak tenang', 'Tajam, berbahaya, dan tegang', 'Patah-patah dan berat'],
    correctIndex: 1,
    explanation: 'Setiap jenis garis memiliki karakter: garis lurus memberi kesan tegas, garis zig-zag terkesan dinamis/tegang, sedangkan garis lengkung memberi kesan luwes dan lembut.',
    visualCue: 'garis-ekspresif',
  },
  {
    id: 7,
    topic: 'Garis, Bentuk, Warna, Tekstur & Ruang',
    question: 'Bentuk benda yang menyerupai unsur alam seperti daun, awan, batu sungai, dan hewan disebut bentuk...',
    options: ['Geometris', 'Kubistis', 'Silindris', 'Organis (non-geometris)'],
    correctIndex: 3,
    explanation: 'Bentuk organis adalah bentuk bebas yang terinspirasi dari alam (daun, awan, hewan). Sebaliknya, bentuk teratur seperti kubus atau bola termasuk bentuk geometris.',
    visualCue: 'bentuk-organis',
  },
  {
    id: 8,
    topic: 'Garis, Bentuk, Warna, Tekstur & Ruang',
    question: 'Tiga warna pokok (warna primer) yang tidak dapat dibuat dari campuran warna lain adalah...',
    options: ['Merah, kuning, dan biru', 'Hijau, jingga, dan ungu', 'Merah, hijau, dan hitam', 'Putih, abu-abu, dan biru'],
    correctIndex: 0,
    explanation: 'Merah, kuning, dan biru adalah warna primer. Jika dicampur, ketiganya menghasilkan warna sekunder: hijau (kuning+biru), jingga (merah+kuning), dan ungu (merah+biru).',
    visualCue: 'warna-primer',
  },
  {
    id: 9,
    topic: 'Garis, Bentuk, Warna, Tekstur & Ruang',
    question: 'Saat kita meraba kulit kayu terasa kasar, tetapi saat kita melihat lukisan batang kayu permukaannya terasa rata saat disentuh. Lukisan tersebut memiliki...',
    options: ['Tekstur nyata', 'Tekstur semu (maya)', 'Tekstur kasar alami', 'Ruang terbuka'],
    correctIndex: 1,
    explanation: 'Tekstur nyata terasa langsung saat diraba (seperti kulit kayu asli), sedangkan tekstur semu hanya terlihat kasar atau berpola secara visual namun tetap rata jika diraba.',
    visualCue: 'tekstur',
  },
  {
    id: 10,
    topic: 'Garis, Bentuk, Warna, Tekstur & Ruang',
    question: 'Jika pelukis mencampurkan warna merah dan kuning dengan perbandingan seimbang, maka akan menghasilkan warna sekunder yaitu...',
    options: ['Ungu', 'Hijau', 'Jingga (oranye)', 'Cokelat tua'],
    correctIndex: 2,
    explanation: 'Campuran warna primer merah dan kuning menghasilkan warna sekunder jingga (oranye). Sedangkan biru + kuning = hijau, dan merah + biru = ungu.',
    visualCue: 'warna-komplementer',
  },

  // Topik 3: Prinsip Seni Rupa (Soal 11–15)
  {
    id: 11,
    topic: 'Prinsip Seni Rupa',
    question: 'Gambar kupu-kupu dengan bentuk dan motif sayap kiri dan kanan yang sama persis merupakan contoh penerapan prinsip...',
    options: ['Keseimbangan simetris', 'Keseimbangan asimetris', 'Irama progresif', 'Kontras ekstrem'],
    correctIndex: 0,
    explanation: 'Keseimbangan simetris terjadi ketika objek di sisi kiri dan kanan (atau atas dan bawah) memiliki bentuk, ukuran, dan bobot visual yang sama persis seperti cermin.',
    visualCue: 'keseimbangan',
  },
  {
    id: 12,
    topic: 'Prinsip Seni Rupa',
    question: 'Prinsip seni rupa yang membuat semua bagian gambar tampak saling menyatu, serasi, dan tidak terpecah-pecah disebut...',
    options: ['Proporsi', 'Kesatuan (unity)', 'Irama', 'Penekanan'],
    correctIndex: 1,
    explanation: 'Kesatuan (unity) adalah prinsip yang memadukan seluruh unsur seni rupa dalam sebuah karya agar tampak harmonis dan utuh sebagai satu kesatuan.',
    visualCue: 'kesatuan',
  },
  {
    id: 13,
    topic: 'Prinsip Seni Rupa',
    question: 'Pengulangan pola motif batik atau deretan tiang lampu yang teratur pada sebuah gambar menciptakan prinsip...',
    options: ['Proporsi', 'Irama (ritme)', 'Gelap terang', 'Tekstur nyata'],
    correctIndex: 1,
    explanation: 'Irama (ritme) dalam seni rupa adalah pengulangan satu atau beberapa unsur (garis, bentuk, motif, atau warna) secara teratur sehingga terasa mengalir dan hidup.',
    visualCue: 'irama',
  },
  {
    id: 14,
    topic: 'Prinsip Seni Rupa',
    question: 'Saat menggambar wajah manusia, ukuran mata, hidung, dan telinga harus sesuai dengan besar kepala. Hal ini menerapkan prinsip...',
    options: ['Proporsi', 'Irama', 'Tekstur', 'Gradasi'],
    correctIndex: 0,
    explanation: 'Proporsi adalah perbandingan ukuran antarbagian suatu objek atau antarobjek dalam karya seni agar terlihat wajar, seimbang, dan enak dipandang.',
    visualCue: 'proporsi',
  },
  {
    id: 15,
    topic: 'Prinsip Seni Rupa',
    question: 'Dalam sebuah poster bertema lingkungan, gambar pohon hijau dibuat besar di tengah dengan warna paling cerah agar langsung menarik pandangan. Teknik ini disebut prinsip...',
    options: ['Keseimbangan radial', 'Pusat perhatian (penekanan)', 'Tekstur semu', 'Pengulangan datar'],
    correctIndex: 1,
    explanation: 'Pusat perhatian (emphasis/penekanan) adalah prinsip menonjolkan bagian terpenting dalam karya melalui perbedaan ukuran, warna, atau letak agar langsung terlihat oleh penikmat.',
    visualCue: 'pusat-perhatian',
  },

  // Topik 4: Seni Rupa 2D & 3D (Soal 16–20)
  {
    id: 16,
    topic: 'Seni Rupa 2D & 3D',
    question: 'Ciri utama karya seni rupa dua dimensi (2D) dibandingkan tiga dimensi adalah...',
    options: [
      'Memiliki ukuran panjang, lebar, dan tinggi',
      'Hanya memiliki panjang dan lebar serta dinikmati dari satu arah depan',
      'Memiliki isi atau volume yang bisa dipegang keliling',
      'Selalu terbuat dari tanah liat atau kayu',
    ],
    correctIndex: 1,
    explanation: 'Karya seni rupa dua dimensi hanya memiliki ukuran panjang dan lebar (bidang datar) sehingga umumnya dinikmati dari arah depan saja, seperti lukisan dan poster.',
    visualCue: 'karya-2d',
  },
  {
    id: 17,
    topic: 'Seni Rupa 2D & 3D',
    question: 'Manakah kelompok karya berikut yang seluruhnya merupakan contoh seni rupa tiga dimensi (3D)?',
    options: [
      'Lukisan kanvas, poster, dan batik tulis',
      'Patung batu, vas gerabah, dan origami burung',
      'Foto pemandangan, kolase kertas, dan kaligrafi',
      'Sketsa pensil, komik, dan mozaik datar',
    ],
    correctIndex: 1,
    explanation: 'Patung, vas gerabah, dan origami memiliki panjang, lebar, tinggi, serta volume ruang sehingga dapat dilihat dari berbagai arah dan termasuk karya seni rupa 3D.',
    visualCue: 'karya-3d',
  },
  {
    id: 18,
    topic: 'Seni Rupa 2D & 3D',
    question: 'Membuat kendi atau celengan dari tanah liat yang lunak dengan cara menekan, memijit, dan memutar termasuk teknik...',
    options: ['Menyulam', 'Membentuk (butsir / putar)', 'Mencetak sablon', 'Melukis aquarel'],
    correctIndex: 1,
    explanation: 'Karya gerabah atau keramik dari bahan lunak seperti tanah liat dan plastisin dibuat dengan teknik membentuk (memijit, memilin, butsir, atau meja putar).',
    visualCue: 'teknik-3d',
  },
  {
    id: 19,
    topic: 'Seni Rupa 2D & 3D',
    question: 'Ukiran timbul pada dinding batu candi yang menempel pada bidang datar dan hanya terlihat menonjol dari depan disebut...',
    options: ['Relief', 'Mozaik', 'Patung bebas', 'Karikatur'],
    correctIndex: 0,
    explanation: 'Relief adalah karya seni ukir yang memiliki ketebalan/timbulan di atas permukaan bidang datar (seperti relief Candi Borobudur), sering disebut semi-tiga dimensi.',
    visualCue: 'relief',
  },
  {
    id: 20,
    topic: 'Seni Rupa 2D & 3D',
    question: 'Keranjang buah atau topi caping yang dibuat dari bilah bambu yang disusun saling menyilang (tumpang-tindih) menggunakan teknik...',
    options: ['Cor atau tuang', 'Menganyam', 'Pahat batu', 'Stempel'],
    correctIndex: 1,
    explanation: 'Menganyam adalah teknik menyilangkan bahan lentur seperti bambu, rotan, atau daun pandan secara teratur untuk menghasilkan benda pakai maupun hiasan tiga dimensi.',
    visualCue: 'anyaman',
  },
];
