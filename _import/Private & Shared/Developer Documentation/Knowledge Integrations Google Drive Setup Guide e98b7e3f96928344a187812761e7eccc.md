# Knowledge Integrations: Google Drive Setup Guide

*Last updated September 1, 2026*

The Google Drive integration syncs files from a Drive folder you choose — including everything in its subfolders — directly into the 1mind Knowledge Hub. Once connected, the files under that folder sync into the Hub on the schedule you set, and images in your documents can be processed so they show in conversation. When a file changes in Drive, the Hub picks it up on the next sync, so you no longer have to export or re-upload knowledge content by hand.

This guide walks through connecting Google Drive step by step. The whole setup takes a few minutes; after that, the sync runs on its own.

## What you'll need

Before you start, have this ready:

- **The Workspace Admin or Super Admin role in 1mind.** Knowledge integrations are managed at the workspace level, so those are the only two roles that can connect, edit, or remove a source. If you do not see the Integrations page, check your role assignment first.
- **Access to the Google account** that can reach the files you want to sync — you'll sign in to Google during setup and authorize the connection with your own account.
- **The Drive folder URL** you want to sync — copy the link to the folder that holds the content you want in the Hub. Everything under that folder, including subfolders, will be synced.

> **Note:** You authorize the connection through Google's own secure sign-in window. 1mind never sees or stores your Google password — you grant access directly with Google.
> 

## Step-by-step setup

### Step 1 — Open the Google Drive integration in the Console

In the 1mind Console, go to **Integrations → Knowledge Integrations** and click **Configure** on the **Google Drive** card.

![01-google-drive-card.png](Knowledge%20Integrations%20Google%20Drive%20Setup%20Guide/4213a3a8-a823-4cbf-910a-07700e24a042.png)

### Step 2 — Set the sync frequency

Under **Sync Frequency**, choose how often the Hub checks Drive for changes — the options are every 1, 3, 6, 12, or 24 hours. For most teams, **every 24 hours** is the right choice; use the least frequent option that fits how often your content actually changes.

![02-sync-frequency.png](Knowledge%20Integrations%20Google%20Drive%20Setup%20Guide/9e835aa1-1da3-421e-a739-6f6e3c78e4d8.png)

### Step 3 — Enter the folder path

In **Folder Path**, paste the link to the Google Drive folder you want to sync. All files under this path will be synced.

> **Tip:** The connector pulls in the folder you select **and any subfolders inside it**. Because you can configure only one folder, put everything you want in the Hub inside a single parent folder, organized into subfolders as needed.
> 

![03-folder-path.png](Knowledge%20Integrations%20Google%20Drive%20Setup%20Guide/fe02e738-995c-4d3e-b152-050ee9e2643a.png)

### Step 4 — Make your documents presentable(optional), then connect

If you want content in your documents to be processed and shown in conversation, turn on the **Presentable documents** toggle — this generates page images for in-conversation display. Then click **Connect Google Drive**.

![04-presentable-and-connect.png](Knowledge%20Integrations%20Google%20Drive%20Setup%20Guide/47939517-f050-4199-b961-e867e2c12612.png)

### Step 5 — Authorize with Google

Clicking **Connect Google Drive** opens a secure connection window where most settings are already pre-configured. Choose **Authorize with User account**, click **Authorize with Google**, sign in, and grant the requested permissions. When you're done, you'll see **Authentication Succeeded**. Your folder path is already filled in, so click **Save & Test**.

![05-authorize-with-google.png](Knowledge%20Integrations%20Google%20Drive%20Setup%20Guide/4ce1afb9-7e6d-44ce-a079-20f3429c50ea.png)

### Step 6 — Confirm the connection in the Console

The connection runs a set of checks, then returns you to the Console. The Google Drive card shows a **Connected** status, along with the current configuration — **Sync State**, sync **Frequency**, the **Folder** path, and whether **Presentable** is on. A **Synced Files** section appears below; it will be empty until the first sync brings content in.

![06-console-connected-status_1.png](Knowledge%20Integrations%20Google%20Drive%20Setup%20Guide/443ef5f2-936e-4555-b3c6-3b3d8a669ce3.png)

### Step 7 — Wait for the first sync

The first batch of data can take **up to an hour or more** to appear, depending on how much content is under your folder. Your files will move through a **Processing** state as the Hub ingests them; give them time to finish processing.

![07-knowledge-hub-processing_1.png](Knowledge%20Integrations%20Google%20Drive%20Setup%20Guide/a9b5ca67-50a9-4a81-b362-e367ce36019d.png)

### Step 8 — Verify your files in the Knowledge Hub

Once the sync runs, open the **Knowledge Hub**. Your Drive files appear with **Source: Google Drive**, and move from **Processing** to **Completed** as they finish. Confirm the files you expected — from the parent folder and its subfolders — all came through. If you enabled **Presentable documents**, documents also carry the **presentable** tag.

![08-knowledge-hub-completed.png](Knowledge%20Integrations%20Google%20Drive%20Setup%20Guide/ef77030b-7c91-4be4-b5ae-1e6c1e8a27b3.png)

## Troubleshooting

| What you're seeing | What to check |
| --- | --- |
| The connection tests don't pass | Reopen the connection window and complete authorization again, choosing **Authorize with User account** and finishing the Google sign-in. If it keeps failing, disconnect and reconnect. |
| No data has appeared yet | Give it time — the first sync isn't instant, and data can take an hour or more to land depending on volume. Confirm the connection shows a **Connected** status and that the folder path points at the right folder. |
| Files are stuck on Processing | Processing runs after files sync in; larger or image-heavy files take longer. Wait for it to finish, then refresh the Knowledge Hub. |
| Some files from the folder are missing | Confirm they sit under the folder path you configured (or one of its subfolders). Anything outside that parent folder won't be synced. |
| Images aren't showing in conversation | Make sure **Presentable documents** was turned on before connecting. If it was added later, let a fresh sync run so new and updated files are processed with images. |
| A large file never synced | Very large files can be slow to sync or may not import from cloud drives. Re-save as a PDF or split into smaller files, and flag persistent issues to your 1mind contact. |

## FAQ

**What does the Google Drive integration sync?**

Files under the Drive folder you specify, including everything in its subfolders. Images inside documents come across too when **Presentable documents** is on.

**How do I choose what gets synced?**

You provide one folder path, and the Hub syncs everything under it. Because you can configure only one folder, structure the content you want ingested inside a single parent folder.

**Is content presentable?**

Yes — turn on **Presentable documents** before connecting. It generates page images so document visuals can be shown in conversation.

**How long until my data shows up?**

The first sync can take up to an hour or more depending on how much content is under your folder. After that, the Hub checks Drive on the frequency you set.

**Where do the credentials come from, and are they safe?**

There are no credentials to copy for Google Drive. You authorize through Google's own secure sign-in window with your own account. 1mind never sees or stores your Google password.

## Need help?

If you run into anything during setup, reach out to your 1mind contact or Customer Success team. They can confirm your configuration, walk you through the review step, and help if any part of the connection needs attention.