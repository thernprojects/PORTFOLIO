# Tommy Hernandez Portfolio (with admin CMS)

A portfolio site you can fully edit yourself: log in at /admin, upload
images, edit text, add or remove projects and gear, drag to reorder
sections, all without touching code again after this initial deploy.

## What's actually in here

- The public page (`/`) reads everything from stored content, nothing is
  hardcoded into the HTML.
- `/admin` is a password protected dashboard where you make all the edits.
- Images you upload go into Vercel Blob storage (or, if you ever run this
  locally without that set up, into a local folder just for testing).
- The content itself (text, links, layout order) is stored as one JSON
  object in the same Vercel Blob storage.

## One time setup, step by step

### 1. Create a GitHub repo and push this code

If you don't already have GitHub set up: create an account at github.com,
then create a new empty repository. From this folder, run:

```
git init
git add .
git commit -m "Initial portfolio CMS"
git branch -M main
git remote add origin <your-new-repo-url>
git push -u origin main
```

### 2. Import the project into Vercel

Go to vercel.com, log into your account, click "Add New" then "Project",
and import the GitHub repo you just pushed. Vercel will detect it's a
Next.js app automatically. Don't click Deploy yet, first set the
environment variables in the next step (you can also add them after and
redeploy, either order works).

### 3. Create a Blob store

In your Vercel project, go to the Storage tab, click "Create Database",
choose Blob, and create it. Connect it to this project. Vercel will
automatically add a `BLOB_READ_WRITE_TOKEN` environment variable for you,
you don't need to type that one in yourself.

### 4. Add the other two environment variables

In Project Settings → Environment Variables, add:

**SESSION_SECRET**: any long random string. You can generate one by
running this on your own computer if you have Node installed:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Or just mash the keyboard for 40+ characters, it just needs to be long
and not guessable.

**ADMIN_PASSWORD_HASH_B64**: this is your login password, but encoded so
it's never sitting in plain text anywhere. Run this locally:
```
npm install
npm run hash-password -- "1130THomas!"
```
That prints a long string, copy the whole thing into this environment
variable's value.

Important: don't store the raw bcrypt hash directly, and don't put dollar
signs in an env value some other way. Env file tools treat `$` as
variable substitution syntax, which will silently corrupt a bcrypt hash
(they always start with `$2a$` or `$2b$`). The base64 encoding here exists
specifically to avoid that trap.

### 5. Deploy

Click Deploy. Once it finishes, your site is live at the URL Vercel gives
you. Visit `yoursite.vercel.app/admin`, log in with your password, and
start filling in real content, images, and links. That's the URL you'd
put in the "GitHub/portfolio/personal site" field on the application.

### 6. Changing your password later

Run `npm run hash-password -- "your-new-password"` again, copy the new
output, and replace the ADMIN_PASSWORD_HASH_B64 value in Vercel's
settings, then redeploy (or it picks it up automatically depending on
your Vercel settings).

## Running it locally (optional, only if you want to test changes before pushing)

```
npm install
cp .env.example .env.local
```
Fill in `.env.local` with a SESSION_SECRET and ADMIN_PASSWORD_HASH_B64
(same commands as above). Leave BLOB_READ_WRITE_TOKEN blank for local
testing, it'll fall back to storing things in a local folder so nothing
breaks. Then:
```
npm run dev
```
and open http://localhost:3000.

## If something goes wrong

Wrong password that should be right: double check you copied the entire
output of the hash-password script, including the very end of it, into
Vercel's environment variable with no extra spaces or line breaks.

Images not showing up after upload: make sure the Blob store from step 3
is actually connected to this project, that's what BLOB_READ_WRITE_TOKEN
depends on.

Admin page just redirects to login over and over: that usually means
SESSION_SECRET isn't set, or got set to two different values across
redeploys, which invalidates old sessions. Just log in again.
