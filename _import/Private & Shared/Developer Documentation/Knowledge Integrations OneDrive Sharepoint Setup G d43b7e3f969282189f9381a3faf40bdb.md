# Knowledge Integrations: OneDrive/Sharepoint Setup Guide

*Last updated September 1, 2026*

The OneDrive integration syncs files from a OneDrive folder you choose — including everything in its subfolders — directly into the 1mind Knowledge Hub. Once connected, the files under that folder sync into the Hub on the schedule you set, and your documents can be processed so their content shows in conversation. When a file changes in OneDrive, the Hub picks it up on the next sync, so you no longer have to export or re-upload knowledge content by hand.

OneDrive and SharePoint share the same connector in the Console, so the same steps work for either source. This guide walks through connecting OneDrive step by step. The whole setup takes a few minutes; after that, the sync runs on its own.

## What you'll need

Before you start, have this ready:

- **The Workspace Admin or Super Admin role in 1mind.** Knowledge integrations are managed at the workspace level, so those are the only two roles that can connect, edit, or remove a source. If you do not see the Integrations page, check your role assignment first.
- **Access to the Microsoft account** that can reach the files you want to sync — you'll sign in to Microsoft during setup and authorize the connection with your own account.
- **The OneDrive folder link** you want to sync — copy the link to the folder that holds the content you want in the Hub. Everything under that folder, including subfolders, will be synced.

> **Note:** You authorize the connection through Microsoft's own secure sign-in window. 1mind never sees or stores your Microsoft password — you grant access directly with Microsoft.
> 

## Step-by-step setup

### Step 1 — Open the SharePoint/OneDrive integration in the Console

In the 1mind Console, go to **Integrations → Knowledge Integrations** and click **Configure** on the **SharePoint/OneDrive** card. This same card handles both OneDrive and SharePoint.

![01-sharepoint-onedrive-card.png](Knowledge%20Integrations%20OneDrive%20Sharepoint%20Setup%20G/c13b03e7-ad79-497e-a12d-2faf5150c0e5.png)

### Step 2 — Set the sync frequency

Under **Sync Frequency**, choose how often the Hub checks OneDrive for changes — the options are every 1, 3, 6, 12, or 24 hours. For most teams, **every 24 hours** is the right choice; use the least frequent option that fits how often your content actually changes.

![02-sync-frequency.png](Knowledge%20Integrations%20OneDrive%20Sharepoint%20Setup%20G/87e242d9-a051-4027-92c9-0d7a21b6f7b8.png)

### Step 3 — Enter the folder path

In OneDrive, open the folder you want to sync, use **Copy link** to copy its link, then paste it into the **Folder Path** field in the Console. All files under this path will be synced.

> **Tip:** The connector pulls in the folder you select **and any subfolders inside it**. Because you can configure only one folder, put everything you want in the Hub inside a single parent folder, organized into subfolders as needed.
> 

![03-folder-path.png](Knowledge%20Integrations%20OneDrive%20Sharepoint%20Setup%20G/c04c4c48-8f17-452b-a99f-02f1c4243d8a.png)

### Step 4 — Make your documents presentable (optional), then connect

If you want content in your documents to be processed and shown in conversation, turn on the **Presentable documents** toggle — this generates page images for in-conversation display. Then click **Connect SharePoint/OneDrive**.

![04-presentable-and-connect.png](Knowledge%20Integrations%20OneDrive%20Sharepoint%20Setup%20G/7fe1d3ba-43e6-4f23-883d-42ca2fbdc0f4.png)

### Step 5 — Authorize with Microsoft

Clicking **Connect SharePoint/OneDrive** opens a secure connection window where everything is already pre-configured. Click **Authorize** and sign in with your Microsoft account. If you're already signed in and have granted access, it may not prompt again; otherwise, grant 1mind the requested permissions to read from your account. When you're done, you'll see **Authentication Succeeded**, so click **Save & Test**.

![05-authorize-with-microsoft.png](Knowledge%20Integrations%20OneDrive%20Sharepoint%20Setup%20G/2e7fcbdf-f7bc-4cc4-8f2e-de47b515a9b5.png)

### Step 6 — Confirm the connection in the Console

The connection runs a set of checks, then returns you to the Console. The SharePoint/OneDrive card shows a **Connected** status, along with the current configuration — **Sync State**, sync **Frequency**, the **Folder** path, and whether **Presentable** is on. A **Synced Files** section appears below; it will be empty until the first sync brings content in.

![06-console-connected-status.png](Knowledge%20Integrations%20OneDrive%20Sharepoint%20Setup%20G/71acb803-908c-4947-90f7-fdfbdcb2a642.png)

### Step 7 — Wait for the first sync

The first batch of data can take **up to an hour or more** to appear, depending on how much content is under your folder. Your files will move through a **Processing** state as the Hub ingests them; give them time to finish processing.

![07-knowledge-hub-processing.png](Knowledge%20Integrations%20OneDrive%20Sharepoint%20Setup%20G/cce7e2d5-ea9e-4bc7-b3c8-7e2c620a0a24.png)

### Step 8 — Verify your files in the Knowledge Hub

Once the sync runs, open the **Knowledge Hub**. Your OneDrive files appear with **Source: SharePoint/OneDrive**, and move from **Processing** to **Completed** as they finish. Confirm the files you expected — from the parent folder and its subfolders — all came through.

![08-knowledge-hub-completed.png](Knowledge%20Integrations%20OneDrive%20Sharepoint%20Setup%20G/33313464-40d6-4bbf-a138-5007967aa109.png)

## Troubleshooting

| What you're seeing | What to check |
| --- | --- |
| The connection tests don't pass | Reopen the connection window and complete authorization again, clicking **Authorize** and finishing the Microsoft sign-in. If it keeps failing, disconnect and reconnect. |
| No data has appeared yet | Give it time — the first sync isn't instant, and data can take an hour or more to land depending on volume. Confirm the connection shows a **Connected** status and that the folder path points at the right folder. |
| Files are stuck on Processing | Processing runs after files sync in; larger or content-heavy files take longer. Wait for it to finish, then refresh the Knowledge Hub. |
| Some files from the folder are missing | Confirm they sit under the folder path you configured (or one of its subfolders). Anything outside that parent folder won't be synced. |
| Content isn't showing as presentable in conversation | Make sure **Presentable documents** was turned on before connecting. If it was added later, let a fresh sync run so new and updated files are processed. |
| A large file never synced | Very large files can be slow to sync or may not import from cloud drives. Re-save as a PDF or split into smaller files, and flag persistent issues to your 1mind contact. |

## FAQ

**What does the OneDrive integration sync?**

Files under the OneDrive folder you specify, including everything in its subfolders. The same connector also works for SharePoint sites and libraries.

**How do I choose what gets synced?**

You provide one folder path, and the Hub syncs everything under it. Because you can configure only one folder, structure the content you want ingested inside a single parent folder.

**Is content presentable?**

Yes — turn on **Presentable documents** before connecting. It generates page images so document content can be shown in conversation.

**How long until my data shows up?**

The first sync can take up to an hour or more depending on how much content is under your folder. After that, the Hub checks OneDrive on the frequency you set.

**Where do the credentials come from, and are they safe?**

There are no credentials to copy for OneDrive. You authorize through Microsoft's own secure sign-in window with your own account. 1mind never sees or stores your Microsoft password.

## Need help?

If you run into anything during setup, reach out to your 1mind contact or Customer Success team. They can confirm your configuration, walk you through the review step, and help if any part of the connection needs attention.