

const data = {
  community: {
    id: 1,
    fullname: "Великий Хутір",
    domain_name: "test.toolkit.in.ua",
    communityExtra: {
      site_logo_cnap: "/img/logo.png",
      favicon_cnap: "",
      website: "https://demo-community.gov.ua",
      media_links: [
        { section: "Facebook", link: "https://facebook.com" },
        { section: "Telegram", link: "https://t.me" },
        { section: "Instagram", link: "https://instagram.com" },
        { section: "Youtube", link: "https://youtube.com" },
        { section: "Twitter", link: "" },
        { section: "Viber", link: "" },
        { section: "WhatsApp", link: "" },
      ],
      informers_enabled: true,
      show_maps_cnap: true,
      statistic_code_cnap: "",
      qr_viber: "/img/qr-sample.png",
      qr_telegram: "/img/qr-sample.png",
    },
  },

  cnap: {
    id: 1,
    name: "ЦНАП Демо-громади",
    fullname: "Центр надання адміністративних послуг Демо-громади",
    address: "вул. Центральна, 1, м. Демо, 00000",
    phones: "+380 (44) 123-45-67, +380 (44) 765-43-21",
    firstPhone: "+380441234567",
    emails: ["cnap@demo-community.gov.ua", "info@demo-community.gov.ua"],
    hasInnerQueue: true,
    hasOuterQueue: false,
    coordLat: 50.4501,
    coordLng: 30.5234,
    qrFeedbackImage: "/img/qr-sample.png",
    qrFeedbackUrl: "#",
  },

  hasCnapNews: true,

  cnapMessages: [
    {
      alias: "important-news-1",
      title: "Оновлення графіку роботи ЦНАП",
      description:
        "Повідомляємо про зміни в графіку роботи Центру надання адміністративних послуг з 1 січня 2025 року.",
      image: "/img/news-sample-1.png",
      image_name: "news-1.png",
      published_at: "15.01.2025 10:00",
    },
    {
      alias: "important-news-2",
      title: "Нові послуги для громадян",
      description:
        "ЦНАП розширює перелік послуг, які надаються в електронному форматі.",
      image: "/img/sample-1.jpg",
      image_name: "news-2.jpg",
      published_at: "14.01.2025 14:30",
    }
  ],

  digitThematicAreas: [
    {
      id: 1,
      name: "Реєстрація місця проживання",
      description:
        "Послуги з реєстрації та зняття з реєстрації місця проживання для громадян.",
    },
    {
      id: 2,
      name: "Земельні питання",
      description:
        "Оформлення земельних ділянок, отримання витягів та довідок з Державного земельного кадастру.",
    },
    {
      id: 3,
      name: "Будівництво та архітектура",
      description:
        "Отримання дозволів на будівництво, реєстрація декларацій та містобудівні умови.",
    },
    {
      id: 4,
      name: "Соціальний захист",
      description:
        "Оформлення допомог, субсидій та інших соціальних виплат для населення.",
    },
    {
      id: 5,
      name: "Підприємництво",
      description:
        "Реєстрація ФОП та юридичних осіб, отримання дозволів та ліцензій.",
    },
  ],

  cnapDepartments: [
    {
      id: 2,
      fullname: "Віддалене робоче місце ЦНАП",
      address: "вул. Мирна, 5, с. Демо-село, 00001",
      phones: "+380 (44) 111-22-33",
      firstPhone: "+380441112233",
      emails: ["remote@demo-community.gov.ua"],
      coordLat: 50.46,
      coordLng: 30.55,
      name: "Віддалене робоче місце",
    },
  ],

  cnapHead: {
    position: "Начальник ЦНАП",
    surname: "Петренко",
    name: "Олена",
    patronymic: "Іванівна",
    pib: "Петренко Олена Іванівна",
    photo: "/img/photo-1.jpg",
  },

  cnapNews: [
    {
      alias: "news-1",
      title: "Оновлення графіку роботи ЦНАП на зимовий період",
      description:
        "Повідомляємо про зміни в графіку роботи з 1 грудня по 28 лютого.",
      image: "/img/sample-1.jpg",
      image_name: "news-1.jpg",
      published_at: "15.01.2025 | 10:00",
      tags: [{ name: "Графік роботи" }, { name: "ЦНАП" }],
    },
    {
      alias: "news-2",
      title: "Нові електронні послуги доступні у ЦНАП",
      description:
        "Тепер ви можете отримати ще більше послуг без черг та паперів.",
        image: "/img/sample-2.jpg",
      image_name: "news-2.jpg",
      published_at: "14.01.2025 | 14:30",
      tags: [{ name: "Послуги" }, { name: "Електронні" }],
    },
    {
      alias: "news-3",
      title: "День відкритих дверей у ЦНАП",
      description:
        "Запрошуємо всіх бажаючих на день відкритих дверей 20 січня.",
        image: "/img/sample-3.jpg",
      image_name: "news-3.jpg",
      published_at: "13.01.2025 | 09:00",
      tags: [{ name: "Заходи" }, { name: "ЦНАП" }, { name: "Громада" }],
    }
  ],

  pubInfos: [
    {
      alias: "pub-info-1",
      title: "Звіт про роботу ЦНАП за 2024 рік",
      published_at: "10.01.2025",
    },
    {
      alias: "pub-info-2",
      title: "Регламент роботи ЦНАП",
      published_at: "05.01.2025",
    },
    {
      alias: "pub-info-3",
      title: "Положення про ЦНАП",
      published_at: "01.01.2025",
    },
  ],

  galleryImages: [
    {
      url: "/img/sample-1.jpg",
      name: "ЦНАП - головний офіс",
    },
    {
      url: "/img/sample-2.jpg",
      name: "Зона очікування",
    },
    {
      url: "/img/sample-3.jpg",
      name: "Робоча зона",
    },
    {
      url: "/img/news-sample-1.png",
      name: "Зал обслуговування",
    },
    {
      url: "/img/logo.png",
      name: "Вхід до ЦНАП",
    },
    {
      url: "/img/svoi.png",
      name: "Конференц-зал",
    },
  ],

  informers: [
    { type: "number", value: "120+", label: "Послуг", visible: true },
    { type: "number", value: "5000+", label: "Звернень на місяць", visible: true },
    { type: "number", value: "30", label: "Працівників", visible: true },
    {
      type: "link",
      url: "#",
      label: "Електронна черга",
      icon: "schedule",
      visible: true,
    },
  ],

  breadcrumbs: [
    { url: "#", title: "Головна" },
    { url: null, title: "Новини" },
  ],

  // news-all page data
  news: {
    currentPage: 1,
    data: [],
    hasPages: true,
    onFirstPage: true,
    hasMorePages: true,
  },

  todayNews: [
    {
      alias: "today-1",
      title: "Сьогоднішня новина ЦНАП",
      description: "Опис сьогоднішньої новини центру.",
      image: "/img/sample-2.jpg",
      image_name: "today.jpg",
      published_at: "15.01.2025 | 10:00",
      tags: [{ name: "Новини" }],
    },
  ],

  weekNews: [
    {
      alias: "week-1",
      title: "Новина цього тижня",
      description: "Опис тижневої новини.",
      image: "/img/sample-1.jpg",
      image_name: "week1.jpg",
      published_at: "13.01.2025 | 14:00",
      tags: [{ name: "ЦНАП" }, { name: "Послуги" }],
    },
    {
      alias: "week-2",
      title: "Ще одна новина тижня",
      description: "Опис ще однієї тижневої новини.",
      image: "/img/sample-3.jpg",
      image_name: "week2.jpg",
      published_at: "12.01.2025 | 09:00",
      tags: [{ name: "Заходи" }],
    },
  ],

  olderNews: [
    {
      alias: "older-1",
      title: "Старіша новина",
      description: "Опис старішої новини.",
      image: "/img/news-sample-1.png",
      image_name: "older1.jpg",
      published_at: "05.01.2025 | 10:00",
      tags: [{ name: "Архів" }],
    },
  ],

  searchYears: [2025, 2024, 2023],

  searchTags: [
    { name: "Графік роботи" },
    { name: "Послуги" },
    { name: "Електронні" },
    { name: "Заходи" },
    { name: "ЦНАП" },
  ],

  paginationPages: [
    { page: 1, url: "/pages/news-all.html", current: true },
    { page: 2, url: "/pages/news-all.html?page=2", current: false },
    { page: 3, url: "/pages/news-all.html?page=3", current: false },
  ],

  navBottomLinks: [
    { section: "BOTTOM_1", url: "#", title: "Онлайн-запис" },
    { section: "BOTTOM_2", url: "#", title: "Відгуки" },
    { section: "BOTTOM_3", url: "#", title: "Інвестиційний портал" },
    { section: "BOTTOM_4", url: "#", title: "Відкриті дані" },
  ],
};

// Computed: combined list of cnap + departments (mirrors Laravel's collect($cnapDepartments)->prepend($cnap))
data.allInstitutions = [data.cnap, ...data.cnapDepartments];

export default data;
