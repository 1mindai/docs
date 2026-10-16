# Knowledge Integrations: Setup, Troubleshooting & FAQ

*Last updated September 1, 2026*

> **Who can set up an integration:** knowledge integrations are managed at the workspace level, so connecting, editing, or removing a source requires the **Workspace Admin** or **Super Admin** role. Superhuman Managers can upload and manage knowledge but cannot connect a source. Users and Viewers have no Knowledge Hub management access. If you cannot see the Integrations page, check your role assignment first.
> 

Knowledge Integrations connect your existing content sources directly to the 1mind Knowledge Hub. Once you connect a source, your files sync into the Hub automatically on a schedule you choose. When content changes at the source, the Hub picks up the change on the next sync — you no longer have to upload files by hand or remember to refresh them when they go out of date.

Two things to keep in mind:

- **Synced files arrive as drafts.** They land in your Sandbox for review and are not live to your AI agent until you publish them. You always have the final say over what your agent sees.
- **Deletes flow through.** If you remove a file at the source, it comes out of the Hub on the next sync, so old content does not linger.

## What you can connect

| Source | What it syncs | How you connect | Status |
| --- | --- | --- | --- |
| Google Drive | Files from the folders or shared drives you choose | Sign in with your Google account | Available |
| SharePoint | Files from the document libraries you choose | Sign in with your Microsoft account | Available |
| OneDrive | Files from the folders you choose | Sign in with your Microsoft account | Available |
| Box | Files from the folders you choose | Sign in with your Box account | Available |
| Dropbox | Files from the folders you choose | Sign in with your Dropbox account | Available |
| Highspot | Spots, pitches, and sales-enablement content | Credentials from your Highspot admin | Available |
| Confluence | Pages and blog posts from the spaces you choose | Sign in when you connect | Available |
| Salesforce | Knowledge articles, including images | API credentials from an External Client App | Available |
| Notion | Pages from the Notion workspace you connect | Sign in with your Notion account | Available |
| Seismic | Files delivered over SFTP | SFTP details | In progress |
| Atlassian Jira | Issues and project content | Sign in with your Atlassian account | In development |

You can connect several sources at once, but currently only **one connector per type** — for example, one Google Drive and one SharePoint together. Connecting more than one of the same type (such as two separate Google Drive connectors) isn't supported yet; we're working on it. Each connection belongs to the workspace you set it up in.

## How setup works

Setting up an integration takes five steps. After that, the sync runs on its own.

1. **Choose a source.** In the Console, go to **Workspace → Integrations → Knowledge Hub Integrations** and open the card for the source you want.
2. **Configure the sync.** Choose the **folder** you want to bring in (so you only sync the content you intend to) and **how often** the Hub should check for changes — 1, 3, 6, 12, or 24 hours.
3. **Connect and sign in.** Click **Connect**. A secure window opens where you sign in to the source with your own account and grant access. 1mind never sees or stores your password — you authorize the connection directly with the provider. *(Highspot uses credentials instead of a sign-in window — see its section below.)*
4. **Files sync automatically.** The first sync brings in everything in the folder; later syncs bring in only what changed.
5. **Review and publish.** Your synced files arrive in Sandbox as drafts. Review them, then publish to make them live to your agent.

> **Tip:** Choose the least frequent sync that fits how often your content actually changes. For most teams, once every 24 hours is the right balance.
> 

## Setting up each source

### Google Drive

1. Open **Knowledge Hub Integrations → Google Drive**.
2. Choose the **folder to sync** — paste a shared drive link or folder path. Point it at a specific folder, not your whole Drive.
3. Choose **how often to sync** (1, 3, 6, 12, or 24 hours).
4. Click **Connect** and sign in with a Google account that can see those files, then approve access.
5. The connection shows **Pending**, then **Connected**, and the first sync begins.
6. Review the new files in Sandbox and **publish** them.

### SharePoint / OneDrive

1. Open **Knowledge Hub Integrations → SharePoint** (or **OneDrive**).
2. Choose the **folder to sync** — a SharePoint site or library, or a OneDrive folder.
3. Choose **how often to sync**.
4. Click **Connect** and sign in with your Microsoft account, then grant access.
5. Wait for **Connected**, then review and publish from Sandbox.

### Box

1. Open **Knowledge Hub Integrations → Box**.
2. Choose the **folder to sync**.
3. Choose **how often to sync**.
4. Click **Connect** and sign in to Box, then approve access.
5. Wait for **Connected**, then review and publish from Sandbox.

### Dropbox

1. Open **Knowledge Hub Integrations → Dropbox**.
2. Choose the **folder to sync**.
3. Choose **how often to sync**.
4. Click **Connect** and sign in to Dropbox, then approve access.
5. Wait for **Connected**, then review and publish from Sandbox.

### Highspot

Highspot connects with credentials from your Highspot admin rather than a sign-in window. Have these ready:

1. Open **Knowledge Hub Integrations → Highspot**.
2. Enter your **Client ID**, **Client Secret**, and **API Base URL**. Optionally add **Spot IDs** (comma-separated) to limit the sync to specific spots; leave it blank to include everything you can access.
3. Choose **how often to sync**.
4. Click **Connect**. Highspot sets up in the background, so it shows **Pending** for a short while, then **Connected**.
5. Review the new files in Sandbox and **publish** them.

> If a Highspot connection looks stuck, re-check the credentials rather than waiting on a sign-in window.
> 

### Confluence

1. Open **Knowledge Hub Integrations → Confluence**.
2. Choose the **content to sync** (pages and blog posts) and the spaces you want.
3. Choose **how often to sync**.
4. Click **Connect** and sign in to Confluence when prompted.
5. Wait for **Connected**, then review and publish from Sandbox.

### Seismic *(in progress)*

The Seismic connector is currently in progress (files delivered over SFTP). If Seismic matters for you, reach out to your 1mind contact and we'll let you know as soon as it's available.

## What to expect after setup

| Source | How you connect | What you choose | How often it syncs |
| --- | --- | --- | --- |
| Google Drive | Sign in | Shared drive link or folder | 1, 3, 6, 12, or 24 hours |
| SharePoint | Sign in | Site or library | 1, 3, 6, 12, or 24 hours |
| OneDrive | Sign in | Folder | 1, 3, 6, 12, or 24 hours |
| Box | Sign in | Folder | 1, 3, 6, 12, or 24 hours |
| Dropbox | Sign in | Folder | 1, 3, 6, 12, or 24 hours |
| Highspot | Credentials | Specific spots (optional) | 1, 3, 6, 12, or 24 hours |
| Confluence | Sign in | Spaces / content | 1, 3, 6, 12, or 24 hours |
| Seismic | — | — | In progress |

A few things that are true for every source:

- The **first sync** brings in everything in the folder you chose; later syncs bring in **only what changed** (new, updated, and removed files).
- After a sync, files can take up to **15 minutes** to show in the **Synced Files** list on the connector's page, depending on how much content you're syncing. They are then ingested into your workspace Knowledge Hub and made available to all of your workspace's agents; processing can take up to another **10 minutes**.
- Synced files appear in the **Knowledge Hub** with their source shown in the **Source** column.
- **Nothing reaches your agent until you publish it** from Sandbox.

## Connection statuses

On the Integrations list and each connector's page, a connection shows one of these states:

- **Not Connected** — no integration is set up for this source yet.
- **Pending** — the connection is being set up or finishing sign-in.
- **Connected** — signed in and syncing on the schedule you set.
- **Incomplete** — sign-in was started but not finished; reopen the connection and complete it.
- **Broken** — the connection needs attention; sign in again or reconnect.

## Troubleshooting

| What you're seeing | What to check |
| --- | --- |
| The connection shows **Incomplete** or **Broken** | Click **Retry** to reopen the sign-in window and finish granting access. If it keeps happening, reconnect the source. (For Highspot, re-check the credentials instead.) |
| Synced files aren't appearing | Confirm you pointed the connector at the right folder, and give it time — the first sync isn't instant, and files can take up to 15 minutes to show in Synced Files. |
| A large file never synced (no status shown) | Files over 100 MB are not ingested, and files approaching that size — especially large PowerPoint decks — can fail to sync from cloud drives. Re-save the file as a PDF or split it into smaller files, and flag it to your 1mind contact. |
| A video from a cloud drive won't sync or can't be shown | Videos stored in cloud drives can't currently be synced as playable assets. Upload the video file directly to Knowledge Hub instead. |
| A synced file isn't being used by the agent | Make sure you've published the draft from Sandbox and that the document shows as Live. |
| A file you deleted at the source is still in the Hub | It clears on the next scheduled sync — deletes flow through, just not instantly. |
| The status is stuck on Pending | Most sources show Pending until sign-in finishes; Highspot shows Pending for a short while as it sets up. If it doesn't turn Connected, retry or reconnect. |
| The source you need isn't listed | Reach out to your 1mind contact. Seismic is in progress, and Jira is in development. |

## FAQ

**Where do my synced files show up?**

In the Knowledge Hub, with their source shown in the Source column. The connector's own page also lists its synced files.

**Do I have to approve every sync?**

You publish from Sandbox to make synced content live. Nothing reaches your agent until you do — for the first sync and every sync after.

**How fast will a change at the source show up?**

On the next scheduled sync. With a once-a-day schedule, expect changes within a day. Choose a faster schedule only if your content really changes more often.

**Can I connect more than one source?**

Yes — you can connect different types of source at the same time (for example, Google Drive and SharePoint). Currently you can have only one connector per type; support for multiple connectors of the same type is on the way.

**Do you store my password?**

No. For Google Drive, SharePoint, OneDrive, Box, Dropbox, and Confluence, you sign in directly with the provider through a secure window. Highspot uses credentials you provide, which are stored securely.

**What file types can I sync?**

Documents (PDF, DOC, DOCX), presentations (PPT, PPTX), Markdown (MD), images (PNG, JPG, JPEG, GIF, WEBP), video (MP4, MOV, WEBM), and audio (MP3, WAV, M4A). If a specific format matters to you, check with your 1mind contact.

**Is there a file size limit?**

Yes. Files up to **100 MB** can be ingested. For the most reliable syncs, we recommend keeping individual files **under 50 MB** — very large files (for example, big PowerPoint decks) can be slow to sync or may not import from cloud drives. If a large file matters, re-save it as a PDF or split it into smaller files.

**Can I sync videos from my cloud drive?**

Upload video files (MP4, MOV, WEBM) directly to Knowledge Hub instead. Videos stored in cloud drives currently can't be synced as playable assets — direct upload is the reliable path.

**What happens if I disconnect a source?**

The connection and its synced staging files are removed. Check with your 1mind contact before disconnecting.

**How do I keep the sync focused?**

Point each connector at a specific folder (or, for Highspot, specific spots) rather than an entire drive. You'll get more relevant knowledge and a quicker review.

## Tips for a clean setup

- Point each connector at a **focused folder**, not an entire drive — you'll get better knowledge and an easier review.
- Keep the source folder **tidy**. Because deletes flow through, removing an old file at the source removes it from the Hub on the next sync.
- Start with a **once-a-day** schedule and only increase it if your content genuinely changes more often.
- Always **review the first batch** in Sandbox before publishing a new source.

## Need help?

If you run into anything during setup, reach out to your 1mind contact or Customer Success team. They can confirm your configuration, walk you through the review step, and help with any source that needs attention.