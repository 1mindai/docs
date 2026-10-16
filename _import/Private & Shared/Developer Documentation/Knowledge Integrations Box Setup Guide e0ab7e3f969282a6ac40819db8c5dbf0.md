# Knowledge Integrations: Box Setup Guide

*Last updated September 1, 2026*

The Box integration syncs files from a Box folder you choose — including everything in its subfolders — directly into the 1mind Knowledge Hub. Once connected, the files under that folder sync into the Hub on the schedule you set, and your documents can be processed so their content shows in conversation. When a file changes in Box, the Hub picks it up on the next sync, so you no longer have to export or re-upload knowledge content by hand.

This guide walks through connecting Box step by step. The whole setup takes a few minutes; after that, the sync runs on its own.

## What you'll need

Before you start, have this ready:

- **The Workspace Admin or Super Admin role in 1mind.** Knowledge integrations are managed at the workspace level, so those are the only two roles that can connect, edit, or remove a source. If you do not see the Integrations page, check your role assignment first.
- **Access to the Box account** that can reach the files you want to sync — you'll sign in to Box during setup and authorize the connection with your own account.
- **The Box folder** you want to sync — open it in Box and note its folder ID from the URL (the number after `/folder/`). Everything under that folder, including subfolders, will be synced.

> **Note:** You authorize the connection through Box's own secure sign-in window. 1mind never sees or stores your Box password — you grant access directly with Box.
> 

## Step-by-step setup

### Step 1 — Open the Box integration in the Console

In the 1mind Console, go to **Integrations → Knowledge Integrations** and click **Configure** on the **Box** card.

![01-box-card.png](Knowledge%20Integrations%20Box%20Setup%20Guide/759df4e6-b4c0-4190-9a32-af758b4816c5.png)

### Step 2 — Set the sync frequency

Under **Sync Frequency**, choose how often the Hub checks Box for changes — the options are every 1, 3, 6, 12, or 24 hours. For most teams, **every 24 hours** is the right choice; use the least frequent option that fits how often your content actually changes.

![02-sync-frequency.png](Knowledge%20Integrations%20Box%20Setup%20Guide/1e884909-c8ac-4c30-9cd5-338a42213088.png)

### Step 3 — Enter the folder path

In **Folder Path**, enter the Box folder you want to sync. Open the folder in Box and use its folder ID from the URL (the number after `/folder/`). All files under this path will be synced.

> **Tip:** The connector pulls in the folder you select **and any subfolders inside it**. Because you can configure only one folder, put everything you want in the Hub inside a single parent folder, organized into subfolders as needed.
> 

![03-folder-path.png](Knowledge%20Integrations%20Box%20Setup%20Guide/b5dee7e2-9179-4739-9516-4aa4a6669ff6.png)

### Step 4 — Make your documents presentable (optional), then connect

If you want content in your documents to be processed and shown in conversation, turn on the **Presentable documents** toggle — this generates page images for in-conversation display. Then click **Connect Box**.

![04-presentable-and-connect.png](Knowledge%20Integrations%20Box%20Setup%20Guide/4fd48d06-ee57-4acc-8040-8649fb92a22c.png)

### Step 5 — Authorize with Box

Clicking **Connect Box** opens a secure connection window. Click **Authorize** and grant 1mind access to Box. Once you authorize, the remaining settings populate on their own — you don't need to add anything, everything is already filled in. Click **Save & Test**, and you'll see your files discovered.

![05-authorize-with-box.png](Knowledge%20Integrations%20Box%20Setup%20Guide/dc7c10d7-36f9-4dc7-92e1-2eed6a3ef8fa.png)

### Step 6 — Confirm the connection in the Console

The connection runs a set of checks, then returns you to the Console. The Box card shows a **Connected** status, along with the current configuration — **Sync State**, sync **Frequency**, the **Folder**, and whether **Presentable** is on. A **Synced Files** section appears below; it will be empty until the first sync brings content in.

![06-console-connected-status.png](Knowledge%20Integrations%20Box%20Setup%20Guide/48418eb0-e425-4be3-923d-587bdcc09ad0.png)

### Step 7 — Wait for the first sync

The first batch of data can take **up to an hour or more** to appear, depending on how much content is under your folder. Your files will move through a **Processing** state as the Hub ingests them; give them time to finish processing.

![07-knowledge-hub-processing.png](Knowledge%20Integrations%20Box%20Setup%20Guide/a63db02f-e10f-4610-92b5-eea00f926292.png)

### Step 8 — Verify your files in the Knowledge Hub

Once the sync runs, open the **Knowledge Hub**. Your Box files appear with **Source: Box**, and move from **Processing** to **Completed** as they finish. Confirm the files you expected — from the parent folder and its subfolders — all came through.

![08-knowledge-hub-completed.png](Knowledge%20Integrations%20Box%20Setup%20Guide/5be3a5c7-32ac-491a-8c9b-c4365e05ac14.png)

## Troubleshooting

| What you're seeing | What to check |
| --- | --- |
| The connection tests don't pass | Reopen the connection window and complete authorization again, clicking **Authorize** and granting access to Box. If it keeps failing, disconnect and reconnect. |
| No data has appeared yet | Give it time — the first sync isn't instant, and data can take an hour or more to land depending on volume. Confirm the connection shows a **Connected** status and that the folder points at the right folder. |
| Files are stuck on Processing | Processing runs after files sync in; larger or content-heavy files take longer. Wait for it to finish, then refresh the Knowledge Hub. |
| Some files from the folder are missing | Confirm they sit under the folder you configured (or one of its subfolders). Anything outside that parent folder won't be synced. |
| Content isn't showing as presentable in conversation | Make sure **Presentable documents** was turned on before connecting. If it was added later, let a fresh sync run so new and updated files are processed. |
| A large file never synced | Very large files can be slow to sync or may not import from cloud drives. Re-save as a PDF or split into smaller files, and flag persistent issues to your 1mind contact. |

## FAQ

**What does the Box integration sync?**

Files under the Box folder you specify, including everything in its subfolders.

**How do I choose what gets synced?**

You provide one folder, and the Hub syncs everything under it. Because you can configure only one folder, structure the content you want ingested inside a single parent folder.

**Is content presentable?**

Yes — turn on **Presentable documents** before connecting. It generates page images so document content can be shown in conversation.

**How long until my data shows up?**

The first sync can take up to an hour or more depending on how much content is under your folder. After that, the Hub checks Box on the frequency you set.

**Where do the credentials come from, and are they safe?**

There are no credentials to copy for Box. You authorize through Box's own secure sign-in window with your own account. 1mind never sees or stores your Box password.

## Need help?

If you run into anything during setup, reach out to your 1mind contact or Customer Success team. They can confirm your configuration, walk you through the review step, and help if any part of the connection needs attention.