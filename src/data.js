// ✎ Всё содержимое страницы — здесь. Меняй тексты и ссылки, остальное трогать не нужно.

export const PROFILE = {
  name: 'Zero',
  roles: ['разработчик', 'любитель Linux', 'мастер кастомизации', 'строю свои проекты'],
  about: [
    'Я делаю личные и портфолио-проекты: от Telegram-ботов и расширений для VS Code до мобильных приложений и собственного рабочего стола на Hyprland.',
    'Люблю разбираться, как всё устроено изнутри, и собирать понимание сам, а не просто копировать готовое. Поэтому почти каждый проект для меня — ещё и способ чему-то научиться.',
  ],
  facts: ['Arch Linux в повседневке', 'Дизайн: алый, чёрный, чуть дерзости', 'Всё доделываю до деплоя'],
}

export const SKILLS = ['React', 'React Native', 'Expo', 'Tailwind', 'TypeScript', 'Python', 'aiogram', 'PostgreSQL', 'Docker', 'Linux', 'Hyprland', 'VS Code API', 'Arch', 'Spring', 'C++', 'Django', 'Github Actions', 'Redis']

export const PROJECTS = [
  { title: 'Hyprland-десктоп', text: 'Собственное окружение на AGS v3 под Arch Linux: бар, виджеты и единая тема.', tags: ['Arch', 'Hyprland', 'AGS'], href: '#projects' },
  { title: 'Markdown Slash', text: 'Расширение для VS Code: набираешь «/» в Markdown и получаешь меню форматирования.', tags: ['VS Code', 'Markdown'], href: 'https://github.com/XZERON0/MarkdownExtension' },
  { title: 'Task Board', text: 'Задачи проекта прямо в редакторе: статусы, ссылки на файлы и обзорная панель.', tags: ['VS Code', 'Dashboard'], href: 'https://github.com/XZERON0/TaskBoardExtension' },
  { title: 'Бот расписания Esil', text: 'Telegram-бот с расписанием университета: быстро открыл, сразу увидел пары.', tags: ['Python', 'aiogram', 'PostgreSQL', 'Github Actions'], href: 'https://github.com/XZERON0/ScheduleBot' },
  { title: 'Бот уведомлении и помощник', text: 'Telegram-бот с возможностью уведомления пользователя и так же удобства с быстрыми настройками. Реализовано локализация на 4 языка', tags: ['aiogram', 'Python', 'i8n', 'Postgresql', 'Docker'], href: 'https://github.com/XZERON0/Mangato' },
  { title: 'Сайт каталог манг', text: 'Современный сайт с большим функционалом, которые упрощает использование каталога. Автоперевод манг является первым решением. В каталоге есть локализация на русский, корейский, английский и японский.', tags: ['Django', 'Python', 'Javasrcipt', 'Tailwind', 'Docker', 'Redis', 'Nginx'], href: 'https://github.com/XZERON0/Mangato' },
  { title: 'Еще больше проектов есть в моем GitHub', text: '', tags: [], href: 'https://github.com/XZERON0/' },
]

export const ART = [
  { src: '/art/samurai.webp', pos: '70%', alt: 'Девушка с катаной и драконом на спине' },
  { src: '/art/white.webp', pos: '50%', alt: 'Девушка с белыми волосами в чёрном' },
  { src: '/art/oni.webp', pos: '50%', alt: 'Девушка с рогами они и татуировками на руке' },
  { src: '/art/glasses.webp', pos: '50%', alt: 'Девушка в красных очках' },
  { src: '/art/sword.webp', pos: '50%', alt: 'Девушка с мечом и косой' },
  { src: '/art/cross.webp', pos: '50%', alt: 'Девушка с крестами и чокером' },
  { src: '/art/bob.webp', pos: '50%', alt: 'Девушка с каре в красной куртке' },
  { src: '/art/shades.webp', pos: '50%', alt: 'Девушка в круглых очках с розой в волосах' },
]

// ✎ Подставь свои ссылки
export const LINKS = [
  { label: 'GitHub', href: 'https://github.com/XZERON0' },
  { label: 'Telegram', href: 'https://t.me/ZER0No' },
  { label: 'Почта', href: 'mailto:zeros71andy@gmail.com' },
]
