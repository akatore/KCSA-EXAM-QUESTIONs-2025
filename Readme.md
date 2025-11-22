# 📘 [KCSA Exam Questions 2025 — React Quiz App](https://akatore.github.io/KCSA-EXAM-QUESTIONs-2025/) 

```
 https://akatore.github.io/KCSA-EXAM-QUESTIONs-2025/ 
```

A fully interactive **React + Tailwind CSS v3** MCQ Quiz App built and deployed using **GitHub Codespaces** and **GitHub Pages**.

This guide explains:

* Setting up the project in GitHub Codespaces
* Installing and configuring Tailwind CSS v3
* Running the React app
* Deploying to GitHub Pages
* Fixing the “white screen” issue during deployment

---

## 🚀 Features

✔ Built with **React + Vite**
✔ Styled using **Tailwind CSS v3**
✔ Beautiful UI animations (`animate-in`, `fade-in`, `zoom-in`, etc.)
✔ Fully responsive
✔ Hosted online using GitHub Pages
✔ Easy to extend with more questions

---

# 🛠️ 1. Setup in GitHub Codespaces

Open your repository in **GitHub Codespaces**:

1. Go to your repository
2. Click **Code** → **Codespaces**
3. **Create codespace on main**

This opens a full VS Code environment in your browser.

---

# 🎨 2. Install Tailwind CSS v3 (Important!)

Tailwind v4 breaks your animation classes, so you must use **Tailwind CSS v3**.

### **Step 1 — Remove Tailwind v4**

```bash
npm uninstall tailwindcss
npm uninstall -D tailwindcss
```

Clean environment:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

### **Step 2 — Install Tailwind v3**

```bash
npm install -D tailwindcss@3 postcss autoprefixer
```

Initialize config:

```bash
npx tailwindcss init -p
```

This creates:

```
tailwind.config.js
postcss.config.js
```

---

### **Step 3 — Configure Tailwind**

Replace your **tailwind.config.js** with:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

### **Step 4 — Fix index.css**

Replace everything with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Optional custom CSS below */
```

---

# ▶️ 3. Run the App

Start the Vite dev server:

```bash
npm run dev
```

Click **"Open in Browser"** when Codespaces prompts you.

Your quiz should now work with full animations.

---

# 🌐 4. Deploy to GitHub Pages

This makes your app accessible online at:

```
https://yourusername.github.io/your-repo/
```

---

## **Step 1 — Fix vite.config.js base path**

Find `vite.config.js` and insert:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/KCSA-EXAM-QUESTIONs-2025/",
});
```

⚠️ Must match **repo name exactly**
⚠️ Any mismatch = white screen

---

## **Step 2 — Install gh-pages**

```bash
npm install --save-dev gh-pages
```

---

## **Step 3 — Add deployment scripts (package.json)**

Inside `"scripts"`:

```json
"dev": "vite",
"build": "vite build",
"preview": "vite preview",
"deploy": "gh-pages -d dist"
```

---

## **Step 4 — Build and Deploy**

### Build:

```bash
npm run build
```

### Deploy:

```bash
npm run deploy
```

This generates the **gh-pages** branch.

---

## **Step 5 — Commit and push your changes**

```bash
git add .
git commit -m "Setup Tailwind v3 + GitHub Pages deployment"
git push
```

---

## **Step 6 — Enable GitHub Pages**

Go to:

**Settings → Pages**

Set:

* **Source:** Deploy from branch
* **Branch:** `gh-pages`
* **Folder:** `/ (root)`

Click **Save**.

Your site will be live shortly.

---

# ⚠️ White Screen Troubleshooting

If you see a blank page at:

```
https://akatore.github.io/KCSA-EXAM-QUESTIONs-2025/
```

check these:

### ✔ Correct Vite base path?

Must be:

```
base: "/KCSA-EXAM-QUESTIONs-2025/"
```

### ✔ Tailwind v4 removed?

Use:

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### ✔ App.jsx exported correctly?

Must have:

```js
export default App;
```

### ✔ Rebuilt after fixing configs?

```
npm run build
npm run deploy
```

---

# 🎉 Final Result

Your quiz is now:

* ✔ Fully functional
* ✔ Styled with Tailwind v3 animations
* ✔ Online on GitHub Pages
* ✔ Ready to share

---
