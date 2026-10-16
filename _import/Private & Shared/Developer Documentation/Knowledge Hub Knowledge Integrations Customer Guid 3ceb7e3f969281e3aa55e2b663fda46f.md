# Knowledge Hub: Knowledge Integrations Customer Guide

*Last updated September 1, 2026*

Knowledge Integrations connect your existing content sources directly to the 1mind Knowledge Hub. Once you connect a source, your files sync into the Hub automatically on a schedule you choose. When documents change at the source, the Hub picks up the change on the next sync. You no longer have to upload files by hand or remember to refresh them when they go out of date.

## What you can connect

These connectors are available today:

| Source | What it syncs | How you connect |
| --- | --- | --- |
| Google Drive | Files from the folders you select | Sign in with your Google account |
| SharePoint | Files from the document libraries you select | Sign in with your Microsoft account |
| OneDrive | Files from the folders you select | Sign in with your Microsoft account |
| Box | Files from the folders you select | Sign in with your Box account |
| Dropbox | Files from the folders you select | Sign in with your Dropbox account |
| Confluence | Pages and blog posts from the spaces you select | Sign in with your Atlassian account |
| Highspot | Spots, pitches, and sales enablement content | API credentials from your Highspot admin |
| Salesforce | Knowledge articles, including images | API credentials from an External Client App |
| Notion | Pages from the Notion workspace you connect | Sign in with your Notion account |

**In progress:** SFTP / Seismic (files from an SFTP server, such as Seismic exports) is currently in progress — check with your 1mind contact for availability.

**In development:** Atlassian Jira (issues and project content) is in development and not yet available — check with your 1mind contact for status.

## Who can set this up

Knowledge integrations are managed at the workspace level, so connecting, editing, or removing a source requires the **Workspace Admin** or **Super Admin** role. Superhuman Managers can upload and manage knowledge but cannot connect a source. Users and Viewers have no Knowledge Hub management access. If the Integrations page is not visible to you, check your role assignment first.

## How it works

Setting up an integration takes five steps. After that, the sync runs on its own.

<aside>
🧭

The five steps below show the typical flow for **cloud file sources** (Google Drive, SharePoint, OneDrive, Box, Dropbox, Confluence), and the screenshots use Google Drive as an example. The overall flow is the same for every source — what differs is mainly **Step 3 (connect)**: Highspot and Salesforce use **API credentials** instead of a sign-in window. For exact, screenshot-by-screenshot steps for your source, use the **Per-source setup guides** at the end of this page.

</aside>

### Step 1: Choose a source

In the Console, go to Workspace → Integrations → Knowledge Hub Integrations, then pick the connector you need. You will see a card for each available source.

> 
> 
> 
> ![ai-edited-image.png](Knowledge%20Hub%20Knowledge%20Integrations%20Customer%20Guid/ai-edited-image.png)
> 

### Step 2: Configure the sync

Set two things:

- **Folder path:** point the connector at the specific folder or library you want to sync, so you only bring in the content you intend to.
- **Sync frequency:** choose how often the Hub checks the source for changes — 1, 3, 6, 12, or 24 hours.

> 
> 
> 
> ![Screenshot 2026-06-11 at 6.02.51 PM.png](Knowledge%20Hub%20Knowledge%20Integrations%20Customer%20Guid/Screenshot_2026-06-11_at_6.02.51_PM.png)
> 

> **Recommendation:** use the least frequent option that fits how often your content actually changes. For most teams, every 24 hours is the right choice. More frequent syncing rarely helps and adds load.
> 

### Step 3: Authenticate

After you click Connect, a secure connection window opens. Sign in to your source with your own account and grant access. *1mind never sees or stores your password* — you authorize the connection directly with the source provider.

> 
> 
> 
> ![image.png](Knowledge%20Hub%20Knowledge%20Integrations%20Customer%20Guid/image.png)
> 

> 
> 
> 
> ![image.png](Knowledge%20Hub%20Knowledge%20Integrations%20Customer%20Guid/image%201.png)
> 

**Highspot works differently:** instead of a sign-in window, you enter API credentials directly in the Console — Client ID, Client Secret, API Base URL, and optional Spot IDs. Fivetran stores these securely.

### Step 4: Files sync automatically

Once connected, the Hub pulls your files on the schedule you set. It handles three kinds of changes on its own:

- New files at the source are added to the Hub.
- Updated files are refreshed with the latest version.
- Files deleted at the source are removed from the Hub.

> 
> 
> 
> ![Screenshot 2026-06-11 at 6.10.13 PM.png](Knowledge%20Hub%20Knowledge%20Integrations%20Customer%20Guid/Screenshot_2026-06-11_at_6.10.13_PM.png)
> 

<aside>
💡

1. Depending on how much content you are syncing, files can take up to **15 minutes** to appear in the **Synced Files** section on the connector's configuration page.
2. Synced files are automatically ingested into your workspace Knowledge Hub and made available to all Superhumans in the workspace. After a sync completes, it can take up to another **10 minutes** for the files to finish processing.
</aside>

### Step 5: Review and publish

Synced files arrive in your workspace **as drafts**. They are not visible to your AI agent yet. Once you set the cadence frequency, documents sync automatically whenever changes are made, and each batch lands as a draft. Changes only take effect after you publish them from Sandbox. This gives you a checkpoint to review what came in before it reaches live conversations.

## What to expect after setup

| Question | Answer |
| --- | --- |
| Where do synced files show up? | In the Knowledge Hub document list, with their source shown in the Source column. |
| Do I have to approve every sync? | You publish from Sandbox to make synced content live. Nothing reaches your agent until you do. |
| How fast will a change appear? | On the next scheduled sync. With a 24-hour frequency, expect changes within a day. |
| Can I connect more than one source? | Yes. You can connect different types of source at the same time (for example, Google Drive and SharePoint). 
Currently you can have only one connector per type; support for multiple connectors of the same type is on the way. |
| What if I disconnect a source? | The connection and its synced staging data are removed. Review with your 1mind contact before disconnecting. |

## Connection statuses

On the Integrations list and each connector's page, a connection shows one of these states:

- **Not Connected** — no integration is set up for this source yet.
- **Pending** — the connection is being set up or finishing authentication.
- **Connected** — authenticated and syncing on the schedule you set.
- **Incomplete** — authentication was started but not completed; reopen the connection and finish it.
- **Broken** — the connection needs attention; re-authenticate or reconnect.

## Tips for a clean setup

- **Keep individual files under 100 MB** — that is the ingestion limit. For the most reliable syncs, we recommend keeping files **under 50 MB**; very large files (such as big PowerPoint decks) can be slow to sync or may not import from cloud drives. If a large deck matters, re-save it as a PDF or split it into smaller files.
- **Upload videos directly.** Videos stored in cloud drives can't currently be synced as playable assets — upload video files straight into Knowledge Hub instead.
- Point each connector at a focused folder rather than an entire drive. You will get more relevant knowledge and an easier review step.
- Keep the source folder tidy. Because deletes flow through, removing an outdated file at the source removes it from the Hub on the next sync.
- Start with a daily (24 hour) frequency and only increase it if your content genuinely changes more often.
- Always review the draft batch in Sandbox before publishing, especially for the first sync from a new source.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| A connector shows an incomplete or broken status | Re-open the connection window and finish authentication. If it persists, the connection may need to be reconnected. |
| Synced files are not appearing | Confirm the folder path points at the right folder and that the first sync interval has passed. |
| A large file never synced (no status shown) | Files over 100 MB are not ingested, and files approaching that size — especially large PowerPoint decks — can fail to sync from cloud drives. Re-save the file as a PDF or split it into smaller files, and flag it to your 1mind contact. |
| A video from a cloud drive won't sync or can't be shown | Videos stored in cloud drives can't currently be synced as playable assets. Upload the video file directly to Knowledge Hub instead. |
| A synced file is not being used by the AI | Confirm you have published the draft batch from Sandbox and that the document status is Live. |
| I need a source that is not listed | Reach out to your 1mind contact. SFTP / Seismic is in progress, and Atlassian Jira is in development. |

<aside>
💡

📘 For detailed per-source setup steps, troubleshooting, and FAQs, see [Knowledge Integrations: Setup, Troubleshooting & FAQ](Knowledge%20Integrations%20Setup,%20Troubleshooting%20&%20FA%20938b7e3f96928296a9e18126cdf34b33.md).

</aside>

## Per-source setup guides

For exact, screenshot-by-screenshot steps for a specific source, use its guide:

- [Setup, Troubleshooting & FAQ (all sources)](Knowledge%20Integrations%20Setup,%20Troubleshooting%20&%20FA%20938b7e3f96928296a9e18126cdf34b33.md)
- [Google Drive](Knowledge%20Integrations%20Google%20Drive%20Setup%20Guide%20e98b7e3f96928344a187812761e7eccc.md)
- [OneDrive](Knowledge%20Integrations%20OneDrive%20Sharepoint%20Setup%20G%20d43b7e3f969282189f9381a3faf40bdb.md)
- [Box](Knowledge%20Integrations%20Box%20Setup%20Guide%20e0ab7e3f969282a6ac40819db8c5dbf0.md)
- [Dropbox](Knowledge%20Integrations%20Dropbox%20Setup%20Guide%206dfb7e3f96928313bbe781c6f34f6e6e.md)
- [Salesforce](Knowledge%20Integrations%20Salesforce%20Setup%20Guide%208e6b7e3f9692834489aa01e66614c363.md)
- [Notion](Knowledge%20Integrations%20Notion%20Setup%20Guide%209b2b7e3f969282b590a081ed963dd4bf.md)
- [Confluence](Knowledge%20Integrations%20Confluence%20Setup%20Guide%2062ab7e3f969283d1aedd015bce3f1d89.md)
- Sharepoint (follows the same guide as Onedrive)

## Need help?

If you run into anything during setup, reach out to your 1mind contact or Customer Support team. They can confirm your configuration, walk you through the review step, and help with any connector that needs attention.