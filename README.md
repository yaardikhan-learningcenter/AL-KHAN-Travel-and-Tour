# AL KHAN Travel & Tourism — ERP (cloud edition)

Static web app (HTML + CSS + JS) hosted free on **GitHub Pages**, with the data stored in a free **Supabase** database so every device/employee sees the same books.

## Files
| File | Purpose |
|---|---|
| index.html | Page layout |
| style.css | All styling |
| app.js | The ERP logic (unchanged features) |
| cloud.js | Login + cloud load/save |
| config.js | **Your Supabase URL + anon key go here** |
| supabase-setup.sql | Run once to create the secure table |
| assets/logo.jpg | Company logo |

## Setup (about 15 minutes)
### 1. Supabase (database + login)
1. Sign up at supabase.com -> **New project** (choose a strong DB password, nearest region).
2. **SQL Editor** -> New query -> paste `supabase-setup.sql` -> **Run**.
3. **Authentication -> Providers -> Email**: turn **OFF "Allow new users to sign up"** (so strangers cannot create accounts).
4. **Authentication -> Users -> Add user** -> create an email + password for yourself and each employee (tick "Auto confirm").
5. **Project Settings -> API**: copy the **Project URL** and the **anon public** key into `config.js`.
   (Never use the service_role key.)

### 2. GitHub Pages
1. github.com -> New repository (e.g. `alkhan-erp`). Choose **Private** if your plan allows Pages on private repos, otherwise Public is okay: the anon key is designed to be public, and the data is protected by login.
2. Upload all files (keep the `assets` folder) — "Add file -> Upload files".
3. **Settings -> Pages -> Source: Deploy from a branch -> main / (root) -> Save**.
4. After ~1 minute your app is live at `https://<your-username>.github.io/alkhan-erp/`.

### 3. First login
Open the link, sign in. Your existing data: first open the OLD file in your browser, use **Export backup (.json)**, then in the new site use **Import backup**. (If you open the new site in the same browser as the old one, the local data uploads automatically on first login.)

## Important notes
- **Backups:** also press *Export backup* weekly. Supabase free plan keeps no point-in-time restore.
- **Free plan:** Supabase pauses projects after 1 week of no use; just click Restore in the dashboard.
- **Two people editing at once:** the whole book is one record, so the last save wins. The app warns if newer data exists, but avoid simultaneous editing for now.
- **Data size:** the books are one JSON document; fine for thousands of entries. Avoid uploading huge signature images.
- **Security:** all staff you create can see all data. For per-user permissions or a real multi-table database, the app would need a larger rewrite.
