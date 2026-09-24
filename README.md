# PathFinder

After Class 10 and 12, everyone suddenly has an opinion about what you should do. Relatives, seniors, YouTube, coaching ads. And the actual info (which stream, which exams, which degree) is spread across a hundred tabs.

I built PathFinder to fix that. You answer a couple of questions and it gives you one clear roadmap, step by step: what to choose, which exams to keep an eye on, and the common mistake people make on that path.

Try it here: **[pathfinder-rouge-beta.vercel.app](https://pathfinder-rouge-beta.vercel.app)**

You can use it in two ways:

- **Not sure what to pick?** Tell it your class and what you're interested in, and it suggests a direction.
- **Already know what you want to become?** Type the career (Doctor, CA, Pilot, anything) and it shows the full path from stream selection onwards.

There's also a compare page if you're stuck between two options, like B.Tech vs BCA or Diploma vs 12th.

The roadmaps are generated using Google's Gemini API.

## Running it on your laptop

It's a normal React + Vite project, so setup is quick. You'll need:

- **Node.js** version 20.19 or newer. Just grab the LTS version from [nodejs.org](https://nodejs.org).
- **Git**, if you want to clone. You can also just download the ZIP.
- A **Gemini API key**. It's free, you can get one at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

Not sure if Node is installed? Run `node -v` in a terminal. If it prints a version number, you're good.

**1. Get the code**

```bash
git clone https://github.com/DipzSpell/PathFinder.git
cd PathFinder
```

No Git? Click the green **Code** button above, hit **Download ZIP**, extract it and open a terminal in that folder.

**2. Install the packages**

```bash
npm install
```

**3. Add your API key**

Copy `.env.example` into a new file called `.env`:

```bash
cp .env.example .env
```

(On Windows CMD or PowerShell, use `copy .env.example .env` instead.)

Now open `.env` and paste your key after the `=`:

```
VITE_GEMINI_API_KEY=your_key_here
```

Don't worry, `.env` is in `.gitignore`, so your key won't get pushed anywhere.

**4. Start it**

```bash
npm run dev
```

Open http://localhost:5173 and you should see the app. Press `Ctrl + C` in the terminal when you want to stop it.

### If something goes wrong

- **"Missing VITE_GEMINI_API_KEY"**: your `.env` file isn't being picked up. Make sure it's named exactly `.env` and is in the same folder as `package.json`. Windows sometimes secretly saves it as `.env.txt`, so turn on file extensions in File Explorer and check. Restart `npm run dev` after fixing it.
- **"The API key was rejected"**: the key probably got copied halfway. Create a new one and paste it again.
- **Vite won't start or npm complains about the engine**: your Node version is too old. Update to the latest LTS.
- **Popular careers load but new ones don't**: that's the cache doing its job (more on that below). New searches need a working key and internet.

## Other commands

- `npm run build` makes a production build in `dist/`
- `npm run preview` runs that build locally so you can test it before deploying
- `npm run lint` checks the code with oxlint
- `npm run seed` regenerates the pre-saved results (uses your API key)

## About the caching

I didn't want every visitor to burn an API call, so there are two layers of caching.

First, `src/data/seed.json` has 48 results already generated for the 20 most searched careers, every class + interest combo, and 10 common comparisons. Most people get their answer straight from here.

Second, whatever you generate yourself gets saved in your browser's localStorage for 30 days (up to 80 results), so searching the same thing again is instant.

Searches are case-insensitive, so "Doctor", "doctor" and "DOCTOR" all hit the same result.

One important thing: exam dates and cutoffs change every year. So `npm run seed` should be re-run before every admission season. As a safety net, the app automatically stops using `seed.json` once it's more than 6 months old and goes back to live results.

## Deploying

`npm run build` gives you a `dist/` folder that works on any static host. I'm using Vercel.

Since routing happens on the client side, your host needs to redirect all paths to `index.html`, otherwise pages like `/about` give a 404 on refresh. I've already added `vercel.json` for Vercel and `public/_redirects` for Netlify and Cloudflare Pages, so those work out of the box.

On Vercel or Netlify, put your API key in the project's Environment Variables settings. Don't upload the `.env` file.

If you fork this, change the email and site name in `src/siteConfig.js`.

**Heads up about the API key:** anything starting with `VITE_` ends up inside the JavaScript that gets sent to the browser. So on a public site, someone could find your key through devtools. It's fine for running locally, but for a proper public deployment the Gemini call should go through a small serverless function that keeps the key on the server. All the API logic is in `src/gemini.js`, so it's an easy change.

## How the code is organised

```
src/
  App.jsx               routing and layout
  gemini.js             talks to the Gemini API
  prompts.js            the prompts (also used by the seed script)
  normalize.js          cleans up the AI's JSON so the UI never breaks
  cache.js              seed + localStorage caching
  siteConfig.js         site name, contact email
  data/seed.json        pre-generated results
  pages/                Home, Compare, About, Privacy, Terms, Contact, NotFound
  components/           forms, roadmap timeline, comparison table, loading/error states
scripts/
  build-seed.mjs        generates seed.json
```

Built with React 19, Vite, Tailwind CSS 4 and React Router.

## Please keep in mind

- The roadmaps are AI-generated. They're a good starting point, but always double-check exam dates, cutoffs and eligibility on the official website before making any decision.
- The salary numbers on the compare page are rough estimates, not real survey data.
- You can save any roadmap as a PDF using the "Save as PDF" button. It only prints the roadmap, not the rest of the page.

## License

LGPL-2.1. See [LICENSE](LICENSE).

---

Made by [Dipanshu](https://github.com/DipzSpell). If you find a bug or have an idea, feel free to open an issue.
