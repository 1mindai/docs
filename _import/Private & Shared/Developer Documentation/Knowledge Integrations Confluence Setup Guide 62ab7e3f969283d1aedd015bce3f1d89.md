# Knowledge Integrations: Confluence Setup Guide

*Last updated September 1, 2026*

The Confluence integration syncs pages and blog posts from your Confluence Cloud site directly into the 1mind Knowledge Hub. Once connected, your Confluence content syncs into the Hub on a schedule, and your pages are processed so their content shows in conversation. When content changes in Confluence, the Hub picks it up on the next sync, so you no longer have to export or re-upload knowledge content by hand.

This guide walks through connecting Confluence step by step. The whole setup takes a few minutes; after that, the sync runs on its own.

## What you'll need

- **The Workspace Admin or Super Admin role in 1mind.** Knowledge integrations are managed at the workspace level, so those are the only two roles that can connect, edit, or remove a source. If you do not see the Integrations page, check your role assignment first.

Before you start, have this ready:

- **An active Confluence Cloud account** with permission to access the content you want to sync.
- **Your Confluence username** — the email address you sign in with.
- **Your Confluence domain** — for example, `yoursite.atlassian.net`. Enter it **without** an `https://` prefix and **without** a trailing slash.
- **A Confluence API token** — create one from your Atlassian account security settings. The in-product Setup Guide links to the exact steps for finding your domain and creating a token.

> **Note:** Confluence Data Center is not supported — this connector works with Confluence Cloud.
> 

## Step-by-step setup

### Step 1 — Open the Confluence integration in the Console

In the 1mind Console, go to **Workspace → Integrations → Knowledge Integrations** and click **Configure** on the **Confluence** card.

![step-1-integrations-card.png](Knowledge%20Integrations%20Confluence%20Setup%20Guide/e3ba85aa-39bf-43b5-a475-58ff6c6b965e.png)

### Step 2 — Connect Confluence

On the Confluence page, click **Connect Confluence**. This takes you to the Confluence connection page — click **Continue** to reach the credentials form.

![step-2-connect-confluence.png](Knowledge%20Integrations%20Confluence%20Setup%20Guide/c0dce35f-ea6d-404f-8ed9-07bcd2ed2b62.png)

### Step 3 — Enter your Confluence credentials

On the connection form, fill in:

- **Username** — the email address you sign in to Confluence with.
- **Domain** — your Confluence domain, e.g. `yoursite.atlassian.net`. Do **not** add an `https://` prefix or a trailing slash.
- **API token** — paste the token you created in your Atlassian account.

The Setup Guide on the right links to the exact steps for finding your domain and creating an API token if you need them.

![step-3-enter-credentials.png](Knowledge%20Integrations%20Confluence%20Setup%20Guide/818957d1-370f-4ac8-be9a-81cd590150ac.png)

### Step 4 — Save & Test

Click **Save & Test**. When the connection completes, the Confluence integration shows a green **Connected** status in the Console.

![step-4-save-test-connected.png](Knowledge%20Integrations%20Confluence%20Setup%20Guide/5e29748f-9978-46cd-9442-4c826de505f7.png)

### Step 5 — Return to the Knowledge Hub and wait for the first sync

Go back to the **Knowledge Hub**. The first batch of data can take **an hour or two** to appear, depending on how much content is in your Confluence site. Give it time to start showing up.

![step-5-first-sync-processing.png](Knowledge%20Integrations%20Confluence%20Setup%20Guide/135d72e5-cf8e-47c7-8c57-81870dceefd6.png)

### Step 6 — Verify your files in the Knowledge Hub

Once the sync runs, open the **Knowledge Hub** and confirm your Confluence pages came through with **Source: Confluence** and finished processing. Open a sample document to check the content converted properly.

![step-6-verify-completed.png](Knowledge%20Integrations%20Confluence%20Setup%20Guide/8fe8e214-eddb-49bd-87f5-1f441332a79c.png)

## Troubleshooting

| What you're seeing | What to check |
| --- | --- |
| The connection test doesn't pass | Double-check the username, domain, and API token. Make sure the domain has **no** `https://` prefix and **no** trailing slash, and that the API token is current and hasn't been revoked. Then run **Save & Test** again. |
| No data has appeared yet | Give it time — the first sync isn't instant, and data can take an hour or two to land depending on volume. Confirm the integration shows a **Connected** status. |
| Files are stuck on Processing | Processing runs after content syncs in; larger or content-heavy pages take longer. Wait for it to finish, then refresh the Knowledge Hub. |
| Some pages are missing | Confirm your Confluence account has permission to access those spaces and pages. Content the account can't see won't be synced. |
| Confluence Data Center won't connect | This connector supports Confluence **Cloud** only. Data Center isn't supported. |

## FAQ

**What does the Confluence integration sync?**

Pages and blog posts from your Confluence Cloud site that your account has permission to access.

**Where do I find my domain and API token?**

Your domain is in your Confluence URL (e.g. `yoursite.atlassian.net`). Create an API token from your Atlassian account security settings — the in-product Setup Guide links to the exact steps.

**How should I format the domain?**

Enter it without an `https://` prefix and without a trailing slash — just `yoursite.atlassian.net`.

**Does it support Confluence Data Center?**

No — the connector works with Confluence Cloud only.

**How long until my data shows up?**

The first sync can take an hour or two depending on how much content is in your site. After that, the Hub syncs on a schedule.

## Need help?

If you run into anything during setup, reach out to your 1mind contact or Customer Success team. They can confirm your configuration, walk you through the review step, and help if any part of the connection needs attention.