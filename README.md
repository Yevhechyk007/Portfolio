# Portfolio

Статичне портфоліо на Eleventy та Nunjucks. Сторінки генеруються в `_site/`, навігація працює без JavaScript.

## Запуск

```sh
npm install
npm run dev
```

На Windows PowerShell, якщо заблокований `npm.ps1`, використовуйте `npm.cmd` замість `npm`. Відкривайте адресу сервера, яку виводить Eleventy, а не HTML через `file://`.

```sh
npm run build          # готовий сайт у _site/
npm run check          # збірка, HTML, посилання, метадані та слайди
npm run check:browser  # Chrome, десктоп та мобільні сценарії
```

Браузерна перевірка потребує Chrome у стандартній Windows-папці. Скріншоти зберігаються в тимчасовій папці; шлях виводиться після перевірки.

## Де редагувати

| Зміна | Файл або папка |
| --- | --- |
| Головна, About, освіта, контакти | `src/index.njk` |
| Загальні метадані та домен | `src/_data/site.json` |
| Меню, модалка, CTA, картки | `src/_includes/components/` |
| Спільна структура сторінок | `src/_includes/layouts/` |
| Дані кейсу, картка та слайди | `src/cases/<slug>/index.11tydata.json` |
| Унікальні HTML-секції кейсу | `src/cases/<slug>/index.njk` |
| Зовнішні проєкти на Behance | `src/projects/external/*.njk` |
| Загальні змінні та типографіка | `src/assets/css/base.css` |
| Спільні компоненти та адаптивність | `src/assets/css/components.css` |
| Головна та кейси | `src/assets/css/home.css`, `case.css` |
| Скрипти меню, модалки та анімацій | `src/assets/js/` |
| Ресурси для публікації | `src/assets/` |
| Оригінальні експорти, які не публікуються | `design-source/` |

`_site/` генерується автоматично: не редагуйте його та не додавайте до Git.

## Додати кейс

1. Скопіюйте `src/cases/dripply/` у `src/cases/<slug>/`.
2. Додайте зображення в `src/assets/projects/<slug>/`. Використовуйте нижній регістр та дефіси в назвах.
3. Оновіть у JSON `caseId`, `title`, `description`, `permalink`, `socialImage`, `categoryTitle` та `project`. `permalink` і `project.href` мають збігатися.
4. Верхнє поле `order` визначає порядок картки. Категорія `project.category`: `mobile`, `landings` або `web-apps`.
5. Оновіть `slides`: шлях `src`, необов'язковий `webp`, опис `alt`, розміри `width` і `height`. Перший слайд завантажується одразу, інші — ліниво.
6. Оновіть або приберіть `nextProjectUrl`. Він має відповідати `project.href` іншого проєкту.
7. За потреби додайте HTML у `index.njk`: він з'явиться після слайдів перед футером.
8. Запустіть `npm run check` і перевірте локальний сайт.

Картка автоматично з'являється у відповідній категорії. Нову категорію створюйте за прикладом `src/projects/mobile.njk` та додавайте посилання на головній.

Для зовнішнього проєкту скопіюйте файл з `src/projects/external/`. `permalink: false` означає, що картка потрапляє в колекцію без створення локальної сторінки.

## Публікація

Netlify використовує `netlify.toml`: команда `npm run build`, папка публікації `_site`. Перевірте ці налаштування й у панелі Netlify перед першою публікацією.

Старі адреси `/#mobile`, `/#landings`, `/#web-apps`, `/#case-mobile-v1` і `/#case-government-appointment` підтримує `src/assets/js/legacy-links.js`. Для них потрібен JS: сервер не отримує частину адреси після `#`. Нові адреси працюють без JS.

Невідомі адреси отримують 404 через `src/_redirects`. Статична Netlify-форма збережена. Обкладинки Behance залишені зовнішніми. Оригінальні локальні експорти збережені; нове стиснення зображень у цю міграцію не входило.
