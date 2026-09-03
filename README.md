# This whole readme is AI slop. Take with large grain of salt

# OSS Spy Jail

A small, framework-free Spy Kids-inspired prisoner directory. Everything is plain HTML, CSS, and JavaScript, so you can open it directly or serve it from any basic web host.

The interface includes two color themes: **Archive** and **Night Ops**. The theme button in the header remembers the visitor's selection using `localStorage`. Theme colors are grouped at the top of `css/styles.css` for easy customization.

The **Coffee** tab deliberately uses its own warm café design. Visitors type an order into the counter, and `js/coffee.js` responds according to the drink. Type `help` at the counter to see the available suggestions.

## Run it

The quickest option is to double-click `index.html`.

For a local web server, open a terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Add a prisoner

Open `js/prisoners.js`, copy one prisoner object, and change its fields. The `id` must be unique and URL-friendly (lowercase words separated by hyphens).

The directory and detail page are generated automatically. A prisoner with this ID:

```js
id: "new-prisoner"
```

will use this URL:

```text
prisoner.html?id=new-prisoner
```

## Replace the duck image

1. Add the new image to `assets/`.
2. Change the prisoner's `image` value in `js/prisoners.js`.
3. Keep image paths relative, for example: `assets/new-prisoner.webp`.

## Feedback and uploads

This is a static website, so reviews are stored in the visitor's browser with `localStorage`. The file picker records the selected file's name but does not upload the file anywhere. To receive actual submissions and files, connect the form to a server or form-handling service and apply server-side validation, safe file naming, size limits, malware scanning, and private object storage.

## Main files

- `index.html` — searchable prisoner directory
- `prisoner.html` — reusable detail page
- `coffee.html` — interactive Mr. Coffee ordering counter
- `reviews.html` — feedback form and local review list
- `js/prisoners.js` — prisoner records
- `js/coffee.js` — coffee aliases, replies, help menu, and special commands
- `js/theme.js` — Archive/Night Ops theme controller
- `css/styles.css` — all site styles
- `css/coffee.css` — standalone café visual system
