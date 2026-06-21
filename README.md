<img width="1200" height="630" alt="og-image" src="https://github.com/user-attachments/assets/f6ad8097-d39d-4ac0-a072-66a98ddba759" />


# Knight — лендинг для GitHub Pages

Красивый одностраничный сайт для репозитория
[Knight-Chess-Helper](https://github.com/physicalaff/Knight-Chess-Helper).

Чистый статичный сайт без сборки: `index.html` + `styles.css` + `script.js`.
Шрифт Geist подключается с Google Fonts, остальное — локально. Дизайн в духе
Raycast / Linear / Vercel: тёмная тема, индиго-акцент (взят из самого расширения),
bento-сетка, реальные скриншоты меню и логотип проекта.

## Что внутри

| Файл / папка        | Назначение                                                     |
|---------------------|----------------------------------------------------------------|
| `index.html`        | Разметка и текст (EN по умолчанию + переключатель EN/RU)        |
| `styles.css`        | Дизайн-система: индиго/Geist, стеклянная навигация, bento, адаптив |
| `script.js`         | Рендер доски, анимация стрелки хода Ng5, eval-бар, i18n         |
| `assets/knight-logo.png` | Логотип проекта (зелёный рыцарь)                           |
| `assets/menu-*.png` | Скриншоты меню расширения (тёмное / светлое / настройки)        |
| `assets/favicon-*.png`, `apple-touch-icon.png` | Иконки вкладки               |
| `og-image.png`      | Превью для соцсетей (1200×630)                                  |
| `.nojekyll`         | Отключает обработку Jekyll на GitHub Pages                      |

## Локальный просмотр

Просто откройте `index.html` в браузере, либо поднимите статический сервер
(чтобы корректно работали относительные пути):

```bash
# из папки сайта
python -m http.server 8080
# затем откройте http://localhost:8080
```

## Деплой на GitHub Pages

### Вариант A — папка `docs/` в самом репозитории (проще всего)

URL получится: `https://physicalaff.github.io/Knight-Chess-Helper/`

```bash
# 1. перейдите в локальную копию репозитория Knight-Chess-Helper
cd path/to/Knight-Chess-Helper

# 2. создайте папку docs и скопируйте туда файлы сайта
mkdir -p docs
cp -r path/to/knight-chess-helper-site/* docs/
cp path/to/knight-chess-helper-site/.nojekyll docs/

# 3. закоммитьте и запушьте
git add docs
git commit -m "Add landing page"
git push
```

Затем в репозитории: **Settings → Pages → Build and deployment**
→ Source: **Deploy from a branch** → Branch: **main**, папка **/docs** → Save.
Через минуту сайт будет доступен по адресу выше.

### Вариант B — отдельный сайт пользователя `physicalaff.github.io`

URL получится короче: `https://physicalaff.github.io/`

```bash
# создайте на GitHub пустой репозиторий с именем physicalaff.github.io, затем:
cd path/to/knight-chess-helper-site
git init
git add .
git commit -m "Knight landing page"
git branch -M main
git remote add origin https://github.com/physicalaff/physicalaff.github.io.git
git push -u origin main
```

Pages включится автоматически (Source: branch `main`, папка `/root`).

### Вариант C — ветка `gh-pages`

```bash
cd path/to/Knight-Chess-Helper
git checkout --orphan gh-pages
git rm -rf .
cp -r path/to/knight-chess-helper-site/* .
cp path/to/knight-chess-helper-site/.nojekyll .
git add .
git commit -m "Site"
git push -u origin gh-pages
```

В **Settings → Pages** выберите ветку `gh-pages`, папка `/root`.

## После деплоя

Если выбрали вариант A или C, поправьте абсолютный `og:url` в `index.html`
(сейчас стоит `https://physicalaff.github.io/Knight-Chess-Helper/`) — для варианта B
замените на `https://physicalaff.github.io/`.

## Кастомный домен (по желанию)

Положите файл `CNAME` с вашим доменом (например `knight.example.com`) рядом с
`index.html`, добавьте CNAME-запись у DNS-провайдера на `physicalaff.github.io`,
и укажите домен в **Settings → Pages → Custom domain**.
