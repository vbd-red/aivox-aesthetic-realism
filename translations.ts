import { Language } from './types';

interface TranslationSet {
  headerTitle: string;
  headerSubtitle: string;
  inputLabel: string;
  inputPlaceholder: string;
  formatLabel: string;
  formatSquare: string;
  formatLandscape: string;
  formatPortrait: string;
  countLabel: string;
  modelLabel: string;
  generateBtn: string;
  generatingBtn: string;
  galleryEmptyTitle: string;
  galleryEmptyDesc: string;
  galleryTitle: string;
  downloadAll: string;
  clearAll: string;
  save: string;
  delete: string;
  preview: string;
  close: string;
  tabGenerator: string;
  tabIdeas: string;
  tabAvatar: string;
  tabIdentity: string;
  tabOutpainting: string;
  tabRestoration: string;
  tabScenarios: string;
  tabImageFusion: string;
  tabInitialFrame: string;
  tabNanoBanana: string;
  ifTitle: string;
  ifSubtitle: string;
  ifUploadLabel: string;
  ifPromptLabel: string;
  ifPromptPlaceholder: string;
  ifMaxImages: string;
  ifDownloadZip: string;
  ifSessionResults: string;
  ifProcessBatch: string;
  ifFaceIdStatus: string;
  ifAnchorActive: string;
  ideasLabel: string;
  ideasStyleLabel: string;
  ideasStyleMix: string;
  ideasPlaceholder: string;
  ideasBtn: string;
  ideasThinking: string;
  ideasTitle: string;
  downloadTxt: string;
  usePrompt: string;
  footer: string;
  errorGen: string;
  errorIdeas: string;
  loading: string;
  variants: string;
  transError: string;
  renderModeLabel: string;
  modeRaw: string;
  modeNikon: string;
  family_warmth: string;
  modern_luxury: string;
  scandinavian: string;
  avSectionPhysical: string;
  avSectionStyle: string;
  avSectionScene: string;
  avGender: string;
  avAge: string;
  avEthnicity: string;
  avEyeColor: string;
  avHairStyle: string;
  avHairColor: string;
  avClothing: string;
  avClothingColor: string;
  avEmotion: string;
  avShotType: string;
  avPose: string;
  avLocation: string;
  avAdditional: string;
  avGenerate: string;
  idTitle: string;
  idSubtitle: string;
  idUploadLabel: string;
  idSelectGallery: string;
  idPromptLabel: string;
  idPromptPlaceholder: string;
  idNoRef: string;
  idRefSelected: string;
  idChangeRef: string;
  idSevenAnglesBtn: string;
  idSevenAnglesDesc: string;
  idAngle1: string; idAngle2: string; idAngle3: string; idAngle4: string; idAngle5: string; idAngle6: string; idAngle7: string;
  opTitle: string;
  opSubtitle: string;
  opUploadLabel: string;
  opCanvasLabel: string;
  opPromptLabel: string;
  opPromptPlaceholder: string;
  opChangeImage: string;
  resTitle: string;
  resSubtitle: string;
  resUploadLabel: string;
  resConfigLabel: string;
  resLevel: string;
  resLevelLow: string;
  resLevelBalanced: string;
  resLevelHigh: string;
  resColorize: string;
  resEnhanceFaces: string;
  resDescriptionPlaceholder: string;
  resCompare: string;
  scTitle: string;
  scSubtitle: string;
  scStyleLabel: string;
  scSceneLabel: string;
  scScenePlaceholder: string;
  scAddScene: string;
  scAddIdeas: string;
  scRemoveScene: string;
  scSceneNum: string;
  scDownloadTxt: string;
  scIdeasHintLabel: string;
  scIdeasHintPlaceholder: string;
  fusTitle: string;
  fusSubtitle: string;
  fusImg1Label: string;
  fusImg2Label: string;
  fusPromptLabel: string;
  fusPromptPlaceholder: string;
  fusUpload1: string;
  fusUpload2: string;
  nbTitle: string;
  nbSubtitle: string;
  male: string; female: string;
  child: string; teenager: string; young_adult: string; adult: string; middle_aged: string; elderly: string;
  caucasian: string; african: string; asian: string; latino: string; middle_eastern: string; indian: string; native_american: string;
  blue: string; green: string; brown: string; hazel: string; grey: string; amber: string; heterochromia: string;
  blonde: string; brunette: string; black: string; red: string; white: string; dyed_pink: string; dyed_blue: string;
  short_clean: string; buzz_cut: string; fade: string; long_messy: string; bald: string; dreadlocks: string; afro: string; curly: string;
  long_straight: string; long_wavy: string; bob_cut: string; pixie: string; ponytail: string; braids: string; messy_bun: string;
  suit_tie: string; tshirt_jeans: string; hoodie_pants: string; leather_jacket: string; casual_shirt: string; sportswear: string; winter_coat: string; beachwear: string;
  evening_dress: string; summer_dress: string; blouse_skirt: string; business_suit: string; swimsuit: string;
  neutral: string; happy_smiling: string; serious: string; angry: string; surprised: string; sad: string; romantic: string; confident: string;
  close_up: string; medium_shot: string; full_body: string; waist_up: string; extreme_close_up: string;
  facing_camera: string; looking_away: string; profile_view: string; walking: string; sitting: string; arms_crossed: string; action_pose: string;
  studio_grey: string; studio_white: string; luxury_apartment: string; modern_garden: string; nature_forest: string; beach_sunset: string; modern_office: string; cozy_cafe: string; luxury_living_room: string;
}

export const translations: Record<Language, TranslationSet> = {
  ru: {
    headerTitle: "Aivox: Realism",
    headerSubtitle: "Генератор гиперреалистичных эстетичных образов и кино-нарративов",
    inputLabel: "Описание изображения",
    inputPlaceholder: "Опишите детально, что вы хотите увидеть...",
    formatLabel: "Формат",
    formatSquare: "Квадрат (1:1)",
    formatLandscape: "Пейзаж (16:9)",
    formatPortrait: "Портрет (9:16)",
    countLabel: "Кол-во",
    modelLabel: "Модель",
    generateBtn: "СГЕНЕРИРОВАТЬ",
    generatingBtn: "ГЕНЕРАЦИЯ...",
    galleryEmptyTitle: "Готов к творству",
    galleryEmptyDesc: "Введите описание выше, чтобы создать уникальные изображения.",
    galleryTitle: "Галерея",
    downloadAll: "СКАЧАТЬ ВСЕ",
    clearAll: "ОЧИСТИТЬ",
    save: "СОХРАНИТЬ",
    delete: "Удалить",
    preview: "Просмотр",
    close: "Закрыть",
    tabGenerator: "Генератор",
    tabIdeas: "Идеи Промптов",
    tabAvatar: "Конструктор Аватара",
    tabIdentity: "Сохранение Лица",
    tabOutpainting: "Outpainting",
    tabRestoration: "Реставрация",
    tabScenarios: "Кино-Сценарии",
    tabImageFusion: "Слияние Фото",
    tabInitialFrame: "Начальный Кадр",
    tabNanoBanana: "Nano Banana",
    ifTitle: "Генератор Начальных Кадров",
    ifSubtitle: "Создание визуального якоря (Face ID) из набора референсов. Жесткая фиксация внешности и одежды.",
    ifUploadLabel: "Референсы внешности и одежды (1–6 фото)",
    ifPromptLabel: "Список кадровых описаний (каждая строка — 1 кадр)",
    ifPromptPlaceholder: "Кадр 1: Портрет в светлой гостиной\nКадр 2: Крупный план, улыбается в камеру\nКадр 3: В полный рост на фоне современной архитектуры",
    ifMaxImages: "Максимум 6 изображений",
    ifDownloadZip: "СКАЧАТЬ ПАКЕТ (.ZIP)",
    ifSessionResults: "Результаты генерации",
    ifProcessBatch: "Запустить последовательную генерацию",
    ifFaceIdStatus: "Статус Face ID",
    ifAnchorActive: "Визуальный якорь активен",
    ideasLabel: "Опишите сцену (уют, чистота, комфорт)",
    ideasStyleLabel: "Стиль Кабора",
    ideasStyleMix: "Микс (Все стили)",
    ideasPlaceholder: "Например: Уютный вечер у камина в современном доме...",
    ideasBtn: "Создать варианты",
    ideasThinking: "Думаю...",
    ideasTitle: "Варианты",
    downloadTxt: "Скачать .txt",
    usePrompt: "Использовать (EN)",
    footer: "Powered by Gemini API • Aivox Engine",
    errorGen: "Ошибка генерации. Пожалуйста, проверьте соединение.",
    errorIdeas: "Не удалось сгенерировать промпты.",
    loading: "Загрузка...",
    variants: "Варианты",
    transError: "Ошибка перевода",
    renderModeLabel: "Режим съемки",
    modeRaw: "Lifestyle (Clean)",
    modeNikon: "Commercial (Ultra)",
    family_warmth: "Семейное тепло",
    modern_luxury: "Современный люкс",
    scandinavian: "Скандинавский уют",
    avSectionPhysical: "Внешность",
    avSectionStyle: "Стиль и Одежда",
    avSectionScene: "Сцена и Окружение",
    avGender: "Пол",
    avAge: "Возраст",
    avEthnicity: "Этнос",
    avEyeColor: "Глаза",
    avHairStyle: "Прическа",
    avHairColor: "Цвет волос",
    avClothing: "Одежда",
    avClothingColor: "Цвет одежды",
    avEmotion: "Эмоция",
    avShotType: "План кадра",
    avPose: "Поза",
    avLocation: "Локация",
    avAdditional: "Дополнительно",
    avGenerate: "Создать Аватар",
    idTitle: "Consistency Lock",
    idSubtitle: "Загрузите фото, чтобы персонаж оставался таким же в новых красивых сценах.",
    idUploadLabel: "Фото Персонажа",
    idSelectGallery: "Выбрать из Галереи",
    idPromptLabel: "Описание персонажа в сцене",
    idPromptPlaceholder: "Например: В кожаной куртке, сидит в светлом кафе, пьет латте...",
    idNoRef: "Нет изображения",
    idRefSelected: "Фото загружено",
    idChangeRef: "Изменить",
    idSevenAnglesBtn: "Матрица 7 ракурсов",
    idSevenAnglesDesc: "Создать 7 канонических ракурсов аватара (Face ID + Одежда)",
    idAngle1: "Анфас", idAngle2: "Профиль", idAngle3: "3/4 Оборота", idAngle4: "Сверху", idAngle5: "Снизу", idAngle6: "Сзади", idAngle7: "Полный рост",
    opTitle: "Outpainting",
    opSubtitle: "Расширение границ фото. Добавьте красивый фон.",
    opUploadLabel: "Исходное фото",
    opCanvasLabel: "Новый формат",
    opPromptLabel: "Новое окружение",
    opPromptPlaceholder: "Опишите чистый и ухоженный фон...",
    opChangeImage: "Выбрать другое",
    resTitle: "AI Реставрация",
    resSubtitle: "Восстановление старых снимков до идеального состояния.",
    resUploadLabel: "Старое Фото",
    resConfigLabel: "Настройки",
    resLevel: "Уровень",
    resLevelLow: "Мягкий",
    resLevelBalanced: "Баланс",
    resLevelHigh: "Максимум",
    resColorize: "В цвете",
    resEnhanceFaces: "Улучшить лица",
    resDescriptionPlaceholder: "Особые пожелания...",
    resCompare: "До / После",
    scTitle: "Кино-Сценарии",
    scSubtitle: "Создание красивых последовательных сцен.",
    scStyleLabel: "Стиль",
    scSceneLabel: "Список Актов",
    scScenePlaceholder: "Действие акта...",
    scAddScene: "+ Акт",
    scAddIdeas: "+ Создать Сюжет",
    scRemoveScene: "Удалить",
    scSceneNum: "Act",
    scDownloadTxt: "Скачать .txt",
    scIdeasHintLabel: "Идея сюжета",
    scIdeasHintPlaceholder: "Напр. 'Путешествие мечты'...",
    fusTitle: "Слияние",
    fusSubtitle: "Объедините два фото в одно эстетичное изображение.",
    fusImg1Label: "Фото А (Фон)",
    fusImg2Label: "Фото Б (Объект)",
    fusPromptLabel: "Инструкция",
    fusPromptPlaceholder: "Опишите, как объединить...",
    fusUpload1: "Загрузить А",
    fusUpload2: "Загрузить Б",
    nbTitle: "Nano Banana Generator",
    nbSubtitle: "Сверхбыстрая генерация креативных идей с использованием Nano Banana.",
    male: "Мужчина", female: "Женщина",
    child: "Ребенок", teenager: "Подросток", young_adult: "Молодой (18-25)", adult: "Взрослый (26-35)", middle_aged: "Средний возраст", elderly: "Пожилой",
    caucasian: "Европеец", african: "Африканец", asian: "Азиат", latino: "Latino", middle_eastern: "Ближний Восток", indian: "Indio", native_american: "Коренной американец",
    blue: "Голубые", green: "Зеленые", brown: "Карие", hazel: "Ореховые", grey: "Серые", amber: "Янтарные", heterochromia: "Гетерохромия",
    blonde: "Блонд", brunette: "Брюнет", black: "Черные", red: "Рыжие", white: "Седые/Белые", dyed_pink: "Розовые", dyed_blue: "Синие",
    short_clean: "Аккуратная стрижка", buzz_cut: "Короткая", fade: "Фейд", long_messy: "Стильные длинные", bald: "Лысый", dreadlocks: "Дреды", afro: "Афро", curly: "Кудрявые",
    long_straight: "Прямые", long_wavy: "Волнистые", bob_cut: "Каре", pixie: "Пикси", ponytail: "Хвост", braids: "Косички", messy_bun: "Пучок",
    suit_tie: "Деловой костюм", tshirt_jeans: "Футболка и джинсы", hoodie_pants: "Худи и брюки", leather_jacket: "Кожаная куртка", casual_shirt: "Рубашка", sportswear: "Спорт", winter_coat: "Пальто", beachwear: "Пляж",
    evening_dress: "Вечернее платье", summer_dress: "Летнее платье", blouse_skirt: "Блузка и юбка", business_suit: "Костюм", swimsuit: "Купальник",
    neutral: "Спокойное", happy_smiling: "Улыбка", serious: "Серьезное", angry: "Энергичное", surprised: "Удивление", sad: "Задумчивое", romantic: "Романтичное", confident: "Уверенное",
    close_up: "Лицо", medium_shot: "По пояс", full_body: "Полный рост", waist_up: "Выше пояса", extreme_close_up: "Детали",
    facing_camera: "В камеру", looking_away: "В сторону", profile_view: "Профиль", walking: "Идет", sitting: "Сидит", arms_crossed: "Руки на груди", action_pose: "В движении",
    studio_grey: "Студия", studio_white: "Светлая студия", luxury_apartment: "Люкс апартаменты", modern_garden: "Сад", nature_forest: "Лес", beach_sunset: "Пляж", modern_office: "Офис", cozy_cafe: "Кафе", luxury_living_room: "Гостиная"
  },
  en: {
    headerTitle: "Aivox: Realism",
    headerSubtitle: "Generate hyper-realistic aesthetic images and cinematic narratives",
    inputLabel: "Image Description",
    inputPlaceholder: "Describe in detail what you want to see...",
    formatLabel: "Format",
    formatSquare: "Square (1:1)",
    formatLandscape: "Landscape (16:9)",
    formatPortrait: "Portrait (9:16)",
    countLabel: "Count",
    modelLabel: "Model",
    generateBtn: "GENERATE",
    generatingBtn: "GENERATING...",
    galleryEmptyTitle: "Ready to Create",
    galleryEmptyDesc: "Enter a description above to create unique images.",
    galleryTitle: "Gallery",
    downloadAll: "DOWNLOAD ALL",
    clearAll: "CLEAR ALL",
    save: "SAVE",
    delete: "Delete",
    preview: "Preview",
    close: "Close",
    tabGenerator: "Generator",
    tabIdeas: "Prompt Ideas",
    tabAvatar: "Avatar Builder",
    tabIdentity: "Identity Lock",
    tabOutpainting: "Outpainting",
    tabRestoration: "Photo Restoration",
    tabScenarios: "Cinematic Scenarios",
    tabImageFusion: "Image Fusion",
    tabInitialFrame: "Initial Frame",
    tabNanoBanana: "Nano Banana",
    ifTitle: "Initial Frame Generator",
    ifSubtitle: "Create a visual anchor (Face ID) with strict appearance and clothing lock.",
    ifUploadLabel: "Appearance and Clothing References (1–6 photos)",
    ifPromptLabel: "Frame Description List (each line is 1 frame)",
    ifPromptPlaceholder: "Frame 1: Portrait in a bright living room\nFrame 2: Close-up smiling at camera\nFrame 3: Full body shot in modern park",
    ifMaxImages: "Maximum 6 images",
    ifDownloadZip: "DOWNLOAD BATCH (.ZIP)",
    ifSessionResults: "Generation Results",
    ifProcessBatch: "Start Sequential Generation",
    ifFaceIdStatus: "Face ID Status",
    ifAnchorActive: "Visual Anchor Active",
    ideasLabel: "Describe the scene (cozy, clean, comfort)",
    ideasStyleLabel: "Cinematic Style",
    ideasStyleMix: "Mixed (All Styles)",
    ideasPlaceholder: "E.g. Cozy evening by the fireplace...",
    ideasBtn: "Create Variants",
    ideasThinking: "Thinking...",
    ideasTitle: "Variants",
    downloadTxt: "Download .txt",
    usePrompt: "Use (EN)",
    footer: "Powered by Gemini API • Aivox Engine",
    errorGen: "Generation error. Please check connection.",
    errorIdeas: "Failed to generate prompts.",
    loading: "Loading...",
    variants: "Variants",
    transError: "Translation error",
    renderModeLabel: "Shooting Mode",
    modeRaw: "Lifestyle (Clean)",
    modeNikon: "Commercial (Ultra)",
    family_warmth: "Family Warmth",
    modern_luxury: "Modern Luxury",
    scandinavian: "Scandinavian Minimal",
    avSectionPhysical: "Physical Traits",
    avSectionStyle: "Style & Clothing",
    avSectionScene: "Scene & Environment",
    avGender: "Gender",
    avAge: "Age",
    avEthnicity: "Ethnicity",
    avEyeColor: "Eye Color",
    avHairStyle: "Hair Style",
    avHairColor: "Hair Color",
    avClothing: "Clothing",
    avClothingColor: "Clothing Color",
    avEmotion: "Emotion",
    avShotType: "Shot Type",
    avPose: "Pose",
    avLocation: "Location",
    avAdditional: "Additional Details",
    avGenerate: "Generate Avatar",
    idTitle: "Identity Lock",
    idSubtitle: "Upload a reference to lock the character's face in new aesthetic scenes.",
    idUploadLabel: "Character Reference",
    idSelectGallery: "Select from Gallery",
    idPromptLabel: "Character Description in Scene",
    idPromptPlaceholder: "E.g. In a leather jacket, sitting in a bright cafe, drinking latte...",
    idNoRef: "No image",
    idRefSelected: "Reference Loaded",
    idChangeRef: "Change",
    idSevenAnglesBtn: "7 Angles Matrix",
    idSevenAnglesDesc: "Generate 7 canonical avatar angles (Face ID + Clothing)",
    idAngle1: "Front Face", idAngle2: "Profile", idAngle3: "3/4 View", idAngle4: "Top View", idAngle5: "Hero Shot", idAngle6: "Back View", idAngle7: "Full Body",
    opTitle: "Outpainting",
    opSubtitle: "Extend image borders with a beautiful background.",
    opUploadLabel: "Source Image",
    opCanvasLabel: "Target Aspect Ratio",
    opPromptLabel: "Environment Description",
    opPromptPlaceholder: "Describe a clean and aesthetic background...",
    opChangeImage: "Change Image",
    resTitle: "AI Photo Restoration",
    resSubtitle: "Restore old photos to a pristine state.",
    resUploadLabel: "Old Photo",
    resConfigLabel: "Restoration Settings",
    resLevel: "Restoration Level",
    resLevelLow: "Low",
    resLevelBalanced: "Balanced",
    resLevelHigh: "High",
    resColorize: "Colorize",
    resEnhanceFaces: "Enhance Faces",
    resDescriptionPlaceholder: "Special requests...",
    resCompare: "Compare Before / After",
    scTitle: "Cinematic Scenarios",
    scSubtitle: "Generate narrative storyboards with 10 acts.",
    scStyleLabel: "Style",
    scSceneLabel: "Act List",
    scScenePlaceholder: "Describe the action...",
    scAddScene: "+ Act",
    scAddIdeas: "+ Create Plot",
    scRemoveScene: "Remove",
    scSceneNum: "Act",
    scDownloadTxt: "Download Scenario (.txt)",
    scIdeasHintLabel: "Plot Ideas",
    scIdeasHintPlaceholder: "E.g. 'The Dream Voyage'...",
    fusTitle: "Image Fusion",
    fusSubtitle: "Merge two images into one aesthetic result.",
    fusImg1Label: "Image A (Base)",
    fusImg2Label: "Image B (Object)",
    fusPromptLabel: "Fusion Instructions",
    fusPromptPlaceholder: "Describe how to merge...",
    fusUpload1: "Upload Image A",
    fusUpload2: "Upload Image B",
    nbTitle: "Nano Banana Generator",
    nbSubtitle: "Ultra-fast creative generations using Nano Banana architecture.",
    male: "Male", female: "Female",
    child: "Child", teenager: "Teenager", young_adult: "Young Adult (18-25)", adult: "Adult (26-35)", middle_aged: "Middle Aged", elderly: "Elderly",
    caucasian: "Caucasian", african: "African", asian: "Asian", latino: "Latino", middle_eastern: "Middle Eastern", indian: "Indian", native_american: "Native American",
    blue: "Blue", green: "Green", brown: "Brown", hazel: "Hazel", grey: "Grey", amber: "Amber", heterochromia: "Heterocromia",
    blonde: "Blonde", brunette: "Brunette", black: "Black", red: "Red", white: "White/Grey", dyed_pink: "Dyed Pink", dyed_blue: "Dyed Blue",
    short_clean: "Short Clean", buzz_cut: "Buzz Cut", fade: "Fade", long_messy: "Long Messy", bald: "Bald", dreadlocks: "Dreadlocks", afro: "Afro", curly: "Curly",
    long_straight: "Long Straight", long_wavy: "Long Wavy", bob_cut: "Bob Cut", pixie: "Pixie", ponytail: "Ponytail", braids: "Braids", messy_bun: "Messy Bun",
    suit_tie: "Suit & Tie", tshirt_jeans: "T-Shirt & Jeans", hoodie_pants: "Hoodie & Pants", leather_jacket: "Leather Jacket", casual_shirt: "Casual Shirt", sportswear: "Sportswear", winter_coat: "Winter Coat", beachwear: "Beachwear",
    evening_dress: "Evening Dress", summer_dress: "Summer Dress", blouse_skirt: "Blouse & Skirt", business_suit: "Business Suit", swimsuit: "Swimsuit",
    neutral: "Neutral", happy_smiling: "Happy Smiling", serious: "Serious", angry: "Energetic", surprised: "Surprised", sad: "Thoughtful", romantic: "Romantic", confident: "Confident",
    close_up: "Face", medium_shot: "Medium Shot", full_body: "Full Body", waist_up: "Waist Up", extreme_close_up: "Details",
    facing_camera: "Facing Camera", looking_away: "Looking Away", profile_view: "Profile View", walking: "Walking", sitting: "Sitting", arms_crossed: "Arms Crossed", action_pose: "Action Pose",
    studio_grey: "Studio", studio_white: "Bright Studio", luxury_apartment: "Luxury Apartment", modern_garden: "Modern Garden", nature_forest: "Forest", beach_sunset: "Beach Sunset", modern_office: "Modern Office", cozy_cafe: "Cozy Cafe", luxury_living_room: "Luxury Living Room"
  },
  es: {
    headerTitle: "Aivox: Realismo",
    headerSubtitle: "Generador de imágenes estéticas hiperrealistas y narrativas cinematográficas",
    inputLabel: "Descripción de la imagen",
    inputPlaceholder: "Describe en detalle lo que quieres ver...",
    formatLabel: "Формато",
    formatSquare: "Cuadrado (1:1)",
    formatLandscape: "Paisaje (16:9)",
    formatPortrait: "Retrato (9:16)",
    countLabel: "Cantidad",
    modelLabel: "Modelo",
    generateBtn: "GENERAR",
    generatingBtn: "GENERANDO...",
    galleryEmptyTitle: "Listo para crear",
    galleryEmptyDesc: "Ingresa una descripción arriba para crear imágenes únicas.",
    galleryTitle: "Galería",
    downloadAll: "DESCARGAR TODO",
    clearAll: "LIMPIAR TODO",
    save: "GUARDAR",
    delete: "Eliminar",
    preview: "Vista previa",
    close: "Cerrar",
    tabGenerator: "Generador",
    tabIdeas: "Ideas de Prompts",
    tabAvatar: "Constructor de Avatar",
    tabIdentity: "Bloqueo de Identidad",
    tabOutpainting: "Outpainting",
    tabRestoration: "Restauración de Fotos",
    tabScenarios: "Escenarios Cinematográficos",
    tabImageFusion: "Fusión de Imágenes",
    tabInitialFrame: "Fotograma Inicial",
    tabNanoBanana: "Nano Banana",
    ifTitle: "Generador de Fotogramas Iniciales",
    ifSubtitle: "Crea un ancla visual (Face ID) con un bloqueo estricto de apariencia y vestimenta.",
    ifUploadLabel: "Referencias de Apariencia y Ropa (1–6 fotos)",
    ifPromptLabel: "Lista de descripciones de cuadros (cada línea es 1 cuadro)",
    ifPromptPlaceholder: "Cuadro 1: Retrato en una sala luminosa\nCuadro 2: Primer plano sonriendo a cámara\nCuadro 3: Plano de cuerpo entero en parque moderno",
    ifMaxImages: "Máximo 6 imágenes",
    ifDownloadZip: "DESCARGAR LOTE (.ZIP)",
    ifSessionResults: "Resultados de generación",
    ifProcessBatch: "Iniciar generación secuencial",
    ifFaceIdStatus: "Estado de Face ID",
    ifAnchorActive: "Ancla visual activa",
    ideasLabel: "Describe la escena (acogedora, limpia, confortable)",
    ideasStyleLabel: "Estilo Cinematográfico",
    ideasStyleMix: "Mezcla (Todos los estilos)",
    ideasPlaceholder: "Ej. Tarde acogedora junto a la chimenea...",
    ideasBtn: "Crear Variantes",
    ideasThinking: "Pensando...",
    ideasTitle: "Variantes",
    downloadTxt: "Descargar .txt",
    usePrompt: "Usar (EN)",
    footer: "Desarrollado por Gemini API • Aivox Engine",
    errorGen: "Error de generación. Comprueba la conexión.",
    errorIdeas: "Error al generar prompts.",
    loading: "Cargando...",
    variants: "Variantes",
    transError: "Error de traducción",
    renderModeLabel: "Modo de Renderizado",
    modeRaw: "Lifestyle (Limpio)",
    modeNikon: "Comercial (Ultra)",
    family_warmth: "Calidez Familiar",
    modern_luxury: "Lujo Moderno",
    scandinavian: "Mínimal Escandinavo",
    avSectionPhysical: "Rasgos Físicos",
    avSectionStyle: "Estilo y Ropa",
    avSectionScene: "Escena y Entorno",
    avGender: "Género",
    avAge: "Edad",
    avEthnicity: "Etnicidad",
    avEyeColor: "Color de Ojos",
    avHairStyle: "Estilo de Cabello",
    avHairColor: "Color de Cabello",
    avClothing: "Ropa",
    avClothingColor: "Color de Ropa",
    avEmotion: "Emoción",
    avShotType: "Tipo de Toma",
    avPose: "Pose",
    avLocation: "Ubicación",
    avAdditional: "Detalles Adicionales",
    avGenerate: "Generar Avatar",
    idTitle: "Bloqueo de Identidad",
    idSubtitle: "Sube una referencia para fijar el rostro del personaje en nuevas escenas estéticas.",
    idUploadLabel: "Referencia de Personaje",
    idSelectGallery: "Seleccionar de la Gobernación",
    idPromptLabel: "Descripción del personaje",
    idPromptPlaceholder: "Ej. Con una chaqueta de cuero, sentado en un café luminoso...",
    idNoRef: "Sin imagen",
    idRefSelected: "Referencia Cargada",
    idChangeRef: "Cambiar",
    idSevenAnglesBtn: "Matriz de 7 Ángulos",
    idSevenAnglesDesc: "Generar 7 ángulos canónicos del avatar (Face ID + Ropa)",
    idAngle1: "Frente", idAngle2: "Perfil", idAngle3: "3/4 Vista", idAngle4: "Vista Superior", idAngle5: "Toma Heroica", idAngle6: "Vista Trasera", idAngle7: "Cuerpo Completo",
    opTitle: "Outpainting",
    opSubtitle: "Extiende los bordes de la imagen con un fondo hermoso.",
    opUploadLabel: "Imagen de Origen",
    opCanvasLabel: "Relación de Aspecto Objetivo",
    opPromptLabel: "Descripción del Entorno",
    opPromptPlaceholder: "Describe un fondo limpio y estético...",
    opChangeImage: "Cambiar Imagen",
    resTitle: "Restauración de Fotos con IA",
    resSubtitle: "Restaura fotos antiguas a un estado impecable.",
    resUploadLabel: "Foto Antigua",
    resConfigLabel: "Ajustes de Restauración",
    resLevel: "Nivel de Restauración",
    resLevelLow: "Bajo",
    resLevelBalanced: "Equilibrado",
    resLevelHigh: "Alto",
    resColorize: "Colorear",
    resEnhanceFaces: "Mejorar Rostros",
    resDescriptionPlaceholder: "Peticiones especiales...",
    resCompare: "Comparar Antes / Después",
    scTitle: "Escenarios Cinematográficos",
    scSubtitle: "Genera guiones gráficos narrativos con 10 actos.",
    scStyleLabel: "Style",
    scSceneLabel: "Lista de Actos",
    scScenePlaceholder: "Describe la acción...",
    scAddScene: "+ Acto",
    scAddIdeas: "+ Crear Trama",
    scRemoveScene: "Eliminar",
    scSceneNum: "Acto",
    scDownloadTxt: "Descargar Escenario (.txt)",
    scIdeasHintLabel: "Ideas de Trama",
    scIdeasHintPlaceholder: "Ej. 'El Viaje de los Sueños'...",
    fusTitle: "Fusión de Imágenes",
    fusSubtitle: "Combina dos imágenes en un resultado estético.",
    fusImg1Label: "Imagen A (Base)",
    fusImg2Label: "Imagen B (Objecto)",
    fusPromptLabel: "Instrucciones de Fusión",
    fusPromptPlaceholder: "Describe cómo combinar...",
    fusUpload1: "Subir Imagen A",
    fusUpload2: "Subir Imagen B",
    nbTitle: "Nano Banana Generator",
    nbSubtitle: "Generaciones creativas ultra-rápidas usando Nano Banana.",
    male: "Masculino", female: "Femenino",
    child: "Niño/a", teenager: "Adolescente", young_adult: "Adulto Joven (18-25)", adult: "Adulto (26-35)", middle_aged: "Edad Media", elderly: "Anciano/a",
    caucasian: "Caucásico", african: "Africano", asian: "Asiático", latino: "Latino", middle_eastern: "Medio Oriente", indian: "Indio", native_american: "Nativo Americano",
    blue: "Azul", green: "Verde", brown: "Marrón", hazel: "Avellana", grey: "Gris", amber: "Áмbar", heterochromia: "Heterocromía",
    blonde: "Rubio", brunette: "Castaño", black: "Negro", red: "Pelirrojo", white: "Blanco/Gris", dyed_pink: "Rosa Teñido", dyed_blue: "Azul Teñido",
    short_clean: "Corto Limpio", buzz_cut: "Rapado", fade: "Degradado", long_messy: "Largo Desordenado", bald: "Calvo", dreadlocks: "Rastas", afro: "Afro", curly: "Rizado",
    long_straight: "Largo Liso", long_wavy: "Largo Ondulado", bob_cut: "Corte Bob", pixie: "Pixie", ponytail: "Coleta", braids: "Trenzas", messy_bun: "Moño Desordenado",
    suit_tie: "Traje y Corbata", tshirt_jeans: "Camiseta y Vaqueros", hoodie_pants: "Sudadera y Pantalón", leather_jacket: "Chaqueta de Cuero", casual_shirt: "Camisa Casual", sportswear: "Ropa Deportiva", winter_coat: "Abrigo de Invierno", beachwear: "Ropa de Playa",
    evening_dress: "Vestido de Noche", summer_dress: "Vestido de Verano", blouse_skirt: "Blusa y Falda", business_suit: "Traje de Negocios", swimsuit: "Traje de Baño",
    neutral: "Neutral", happy_smiling: "Feliz Sonriente", serious: "Serio", angry: "Enérgico", surprised: "Sorprendido", sad: "Pensativo", romantic: "Romántico", confident: "Seguro",
    close_up: "Rostro", medium_shot: "Plano Medio", full_body: "Cuerpo Completo", waist_up: "Cintura para arriba", extreme_close_up: "Detalles",
    facing_camera: "Mirando a Cámara", looking_away: "Mirando a otro lado", profile_view: "Vista de Perfil", walking: "Caminando", sitting: "Sentado", arms_crossed: "Brazos Cruzados", action_pose: "Pose de Acción",
    studio_grey: "Estudio", studio_white: "Estudio Brillante", luxury_apartment: "Apartamento de Lujo", modern_garden: "Jardín Moderno", nature_forest: "Bosque", beach_sunset: "Atardecer en la Playa", modern_office: "Oficina Moderna", cozy_cafe: "Cafetería Acogedora", luxury_living_room: "Sala de Lujo"
  }
};