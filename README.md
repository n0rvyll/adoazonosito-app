# 🆔 Adóazonosító Jel Generátor és Ellenőrző

![Adóazonosító generátor előnézet](https://github.com/n0rvyll/adoazonosito-app/blob/main/readme/01.jpeg)

Egy **modern, reszponzív webalkalmazás**, amellyel:
- ✨ **Adóazonosító jelet generálhatsz** a születési dátum és sorszám alapján.
- ✅ **Érvényességet ellenőrizhetsz** és **visszafejtheted a születési időt ÉÉÉÉ-HH-NN formátumban**.
- 📱 Teljesen **reszponzív**, mobilra optimalizált.
- 🌙 **Dark Mode** támogatással.
- ⚡ Élő előnézet és automatikus ellenőrzés.

---

## 🚀 Funkciók

### 🔹 Generálás
- Születési dátum + sorszám megadásával készíthetsz **érvényes adóazonosító jelet**.
- **Előnézet** gombnyomás előtt – már írás közben látod a várható eredményt.
- Tiltott sorszám (`000`) figyelmeztetés.
- Másolás vágólapra egy kattintással.

![Generálás képernyő](https://github.com/n0rvyll/adoazonosito-app/blob/main/readme/02.jpeg)

---

### 🔹 Ellenőrzés
- 10 számjegy beírása után **automatikusan lefut az ellenőrzés**.
- Érvényes jel esetén visszaadja a **születési időt**.
- Színes, jól látható visszajelzés.

---

### 🔹 Tooltip magyarázatok
- Kis ℹ️ ikon, amely kattintva magyarázatot ad a mező funkciójáról.
- ESC vagy kattintás a mezőn kívül bezárja.

![Tooltip példa](https://github.com/n0rvyll/adoazonosito-app/blob/main/readme/03.jpeg)

---

## 📜 Az adóazonosító jel képzése

Az 1996. évi XX. törvény 1. számú melléklete alapján:

1. **Első számjegy**: mindig `8`.
2. **2–6. számjegyek**: a születési dátum és 1867.01.01. között eltelt napok száma.
3. **7–9. számjegyek**: sorszám (alapértelmezett `100`, „000” tiltott).
4. **10. számjegy**: ellenőrző szám (mod 11; ha maradék `10`, új sorszám kell).


---

## 🛠 Technológia

- **[Next.js 14+](https://nextjs.org/)**
- **[React 18+](https://react.dev/)**
- **[Tailwind CSS](https://tailwindcss.com/)** – modern, reszponzív dizájn
- TypeScript a biztonságos kódhoz

---

## 📦 Telepítés és futtatás

```bash
# Projekt klónozása
git clone https://github.com/felhasznalo/adoazonosito-generator.git

cd adoazonosito-generator

# Függőségek telepítése
npm install

# Fejlesztői szerver indítása
npm run dev

# Megnyitás a böngészőben
http://localhost:3000