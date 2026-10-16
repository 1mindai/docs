# Knowledge Integrations: Dropbox Setup Guide

*Last updated September 1, 2026*

The Dropbox integration syncs files from a Dropbox folder you choose — including everything in its subfolders — directly into the 1mind Knowledge Hub. Once connected, the files under that folder sync into the Hub on the schedule you set, and your documents can be processed so their content shows in conversation. When a file changes in Dropbox, the Hub picks it up on the next sync, so you no longer have to export or re-upload knowledge content by hand.

This guide walks through connecting Dropbox step by step. The whole setup takes a few minutes; after that, the sync runs on its own.

## What you'll need

Before you start, have this ready:

- **The Workspace Admin or Super Admin role in 1mind.** Knowledge integrations are managed at the workspace level, so those are the only two roles that can connect, edit, or remove a source. If you do not see the Integrations page, check your role assignment first.
- **Access to the Dropbox account** that can reach the files you want to sync — you'll sign in to Dropbox during setup and authorize the connection with your own account.
- **The Dropbox folder link** you want to sync — open the folder in Dropbox and copy its URL. Everything under that folder, including subfolders, will be synced.

> **Note:** You authorize the connection through Dropbox's own secure sign-in window. 1mind never sees or stores your Dropbox password — you grant access directly with Dropbox.
> 

## Step-by-step setup

### Step 1 — Open the Dropbox integration in the Console

In the 1mind Console, go to **Integrations → Knowledge Integrations** and click **Configure** on the **Dropbox** card.

![01-dropbox-card.png](Knowledge%20Integrations%20Dropbox%20Setup%20Guide/6ed3f3c3-8407-435a-88a1-6d1c8225d024.png)

### Step 2 — Set the sync frequency

Under **Sync Frequency**, choose how often the Hub checks Dropbox for changes — the options are every 1, 3, 6, 12, or 24 hours. For most teams, **every 24 hours** is the right choice; use the least frequent option that fits how often your content actually changes.

![02-sync-frequency.png](Knowledge%20Integrations%20Dropbox%20Setup%20Guide/c01c3ed1-45d1-4f6e-ab7c-835c8647b46f.png)

### Step 3 — Enter the folder path

In Dropbox, open the folder you want to sync and copy its URL, then paste it into the **Folder Path** field in the Console. All files under this path will be synced.

> **Tip:** The connector pulls in the folder you select **and any subfolders inside it**. Because you can configure only one folder, put everything you want in the Hub inside a single parent folder, organized into subfolders as needed.
> 

![03-folder-path.png](Knowledge%20Integrations%20Dropbox%20Setup%20Guide/a635a7a5-e918-470a-959e-049f8bac1f21.png)

### Step 4 — Make your documents presentable (optional), then connect

If you want content in your documents to be processed and shown in conversation, turn on the **Presentable documents** toggle — this generates page images for in-conversation display. Then click **Connect Dropbox**.

![04-presentable-and-connect.png](Knowledge%20Integrations%20Dropbox%20Setup%20Guide/39c9fca0-40bf-4f16-a1da-2353b9f70445.png)

### Step 5 — Authorize with Dropbox

Clicking **Connect Dropbox** opens a secure connection window. Click **Continue**, then **Authorize** to grant access. Select **Replicate unstructured files**, then click **Save & Test**. When the tests pass, you'll be returned to the 1mind Console.

![05-authorize-with-dropbox.png](Knowledge%20Integrations%20Dropbox%20Setup%20Guide/9365ab83-3fa7-4718-b950-d9ebe9a3c713.png)

### Step 6 — Confirm the connection in the Console

Back in the Console, the Dropbox card shows a **Connected** status, along with the current configuration — **Sync State**, sync **Frequency**, the **Folder** path, and whether **Presentable** is on. A **Synced Files** section appears below; it will be empty until the first sync brings content in.

![06-console-connected-status.png](Knowledge%20Integrations%20Dropbox%20Setup%20Guide/01b9d39e-02d9-4f30-8f9d-ce179096828d.png)

### Step 7 — Wait for the first sync

The first batch of data can take **up to an hour or more** to appear, depending on how much content is under your folder. Your files will move through a **Processing** state as the Hub ingests them; give them time to finish processing.

![07-knowledge-hub-processing.png](Knowledge%20Integrations%20Dropbox%20Setup%20Guide/9496ca14-2fd1-430d-af8c-6fb62e90edaf.png)

### Step 8 — Verify your files in the Knowledge Hub

Once the sync runs, open the **Knowledge Hub**. Your Dropbox files appear with **Source: Dropbox**, and move from **Processing** to **Completed** as they finish. Confirm the files you expected — from the parent folder and its subfolders — all came through. If you enabled **Presentable documents**, the Hub extracts the document's knowledge and marks it presentable, creating artifacts it can show in conversation.

![08-knowledge-hub-completed.png](Knowledge%20Integrations%20Dropbox%20Setup%20Guide/bcf2f909-53f1-47ff-8851-c84b084bc3d0.png)

## Troubleshooting

| What you're seeing | What to check |
| --- | --- |
| The connection tests don't pass | Reopen the connection window and complete authorization again, clicking **Continue** and **Authorize**, then selecting **Replicate unstructured files**. If it keeps failing, disconnect and reconnect. |
| No data has appeared yet | Give it time — the first sync isn't instant, and data can take an hour or more to land depending on volume. Confirm the connection shows a **Connected** status and that the folder path points at the right folder. |
| Files are stuck on Processing | Processing runs after files sync in; larger or content-heavy files take longer. Wait for it to finish, then refresh the Knowledge Hub. |
| Some files from the folder are missing | Confirm they sit under the folder path you configured (or one of its subfolders). Anything outside that parent folder won't be synced. |
| Content isn't showing as presentable in conversation | Make sure **Presentable documents** was turned on before connecting. If it was added later, let a fresh sync run so new and updated files are processed. |
| A large file never synced | Very large files can be slow to sync or may not import from cloud drives. Re-save as a PDF or split into smaller files, and flag persistent issues to your 1mind contact. |

## FAQ

**What does the Dropbox integration sync?**

Files under the Dropbox folder you specify, including everything in its subfolders.

**How do I choose what gets synced?**

You provide one folder link, and the Hub syncs everything under it. Because you can configure only one folder, structure the content you want ingested inside a single parent folder.

**Is content presentable?**

Yes — turn on **Presentable documents** before connecting. It generates page images so document content can be shown in conversation.

**How long until my data shows up?**

The first sync can take up to an hour or more depending on how much content is under your folder. After that, the Hub checks Dropbox on the frequency you set.

**Where do the credentials come from, and are they safe?**

There are no credentials to copy for Dropbox. You authorize through Dropbox's own secure sign-in window with your own account. 1mind never sees or stores your Dropbox password.

## Need help?

If you run into anything during setup, reach out to your 1mind contact or Customer Success team. They can confirm your configuration, walk you through the review step, and help if any part of the connection needs attention.