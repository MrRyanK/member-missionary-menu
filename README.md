# Member-Missionary Menu

A small, static webpage for filtering member-missionary activity ideas by
action, effort, and timeframe. The page is plain HTML, CSS, and JavaScript; it
does not require Python, a backend, a build step, or package installation.

Activities are stored in [`data/activities.json`](./data/activities.json). The
filters support multiple selections, and **Next idea** cycles through matching
activities in shuffled order without repeats until the current set is exhausted.
All filters start unselected, so choose at least one option in each group to see
matching ideas.

The catalog contains original starter suggestions, ideas shared by the local
missionaries, and deduplicated ideas transcribed into `data/ideas.txt` from the
Share site. Sources are recorded as metadata in `activities.json` for
maintenance and are not displayed to users. Effort labels are estimates;
timeframe labels follow the source idea's timing category.

## Deploy with Cloudflare Pages

Cloudflare Pages can publish this static site for free at a `*.pages.dev`
address. The deployed site is public to anyone with its URL; do not put private
information in the site.

### 1. Create a GitHub repository

Create a new, empty repository on GitHub. A private repository is fine; the
published Pages site will still be publicly accessible. Do not initialize the
GitHub repository with a README, license, or `.gitignore` because this project
already has its own files.

From this project directory, connect the local repository to the new GitHub
repository and push:

```sh
git remote add origin https://github.com/YOUR-USERNAME/member-missionary-menu.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username and adjust the repository
name if you chose a different one. GitHub may ask you to authenticate.

### 2. Create the Cloudflare Pages project

1. Sign in to the [Cloudflare dashboard](https://dash.cloudflare.com/).
2. Open **Workers & Pages** and select **Create application**.
3. Choose **Pages**, then **Connect to Git**.
4. Connect GitHub and authorize Cloudflare to access the repository.
5. Select the `member-missionary-menu` repository and begin setup.
6. Configure the project:
   - **Production branch:** `main`
   - **Framework preset:** `None` (or **No framework**)
   - **Build command:** `exit 0`
   - **Build output directory:** `.`
   - **Root directory:** leave blank/default
7. Select **Save and Deploy**.

Cloudflare will provide a URL such as
`https://member-missionary-menu.pages.dev`. Open it on your phone or share it
with others.

### 3. Publish future changes

After editing the site, commit and push the changes to the `main` branch.
Cloudflare Pages will automatically deploy the update.
