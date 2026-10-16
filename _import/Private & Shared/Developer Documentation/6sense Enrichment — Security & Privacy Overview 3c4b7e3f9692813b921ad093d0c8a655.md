# 6sense Enrichment — Security & Privacy Overview

*Last updated: August 31, 2026*

---

## Overview

1mind has partnered with 6sense to provide company-level enrichment for anonymous website visitor sessions. When a visitor has a conversation with a Superhuman on a customer's website and does not share their email address or company name, 1mind uses 6sense's IP-to-company matching service to identify the visitor's company. This document describes what data is shared with 6sense, how it is used, and the safeguards in place.

## How It Works

1. A visitor interacts with a Superhuman on a customer's website without identifying their email or company.
2. 1mind sends the user’s IP address from the session to 6sense.
3. 6sense matches the IP address to a company using its own firmographic database and returns the company name to 1mind, when a match exists.
4. 1mind associates the returned company with the corresponding conversation, giving the customer company-level visibility into an otherwise anonymous session.

Note that currently IP addresses are sent to 6sense in a daily batch at the end of each day, not in real time — company data typically appears within 24 hours of a session ending.

No integration work, code changes, or tracking pixel are required on the customer's website. 

This new enrichment capability is provided free for 1mind customers. 

## Data Shared With 6sense

Only the following data elements are sent to 6sense:

| **Data element** | **Shared?** |
| --- | --- |
| IP address | Yes |
| Timestamp | Yes |
| Unique organization ID (identifying an individual 1mind customer tenant, not the customer name itself) | Yes |
| Visitor name, email, or other individual-level PII | No |
| Conversation content / transcript | No |

6sense receives no data that would allow it to identify or correlate activity to an individual end user — only the minimum data needed to perform IP-to-company matching at the account level.

## Purpose of Use

- 6sense enrichment is used solely to attach company-level (firmographic) identity to otherwise anonymous conversations, enabling lead visibility and pipeline/revenue attribution reporting for the customer.
- The service does not perform automated profiling or decision-making that produces legal or similarly significant effects on individuals. It returns company-level match data only; it does not affect how any individual is treated.

## What Is Never Overwritten

If a session already has an identified company (e.g., because the visitor self-identified), that record is not overwritten by 6sense-sourced data. Enrichment only fills in company information for sessions that would otherwise remain unattributed.

## Legal & Compliance Safeguards

- **Data Processing Agreement (DPA):** In place between 1mind and 6sense covering this integration.
- **Cross-border transfer mechanism:** Standard Contractual Clauses (SCCs).
- **Data Privacy Framework (DPF):** 1mind maintains DPF certification ([program list](https://www.dataprivacyframework.gov/list)).
- **Data Transfer Impact Assessment (DTIA):** Available at [1mind's Data Transfer Impact Assessment](https://www.1mind.com/data-transfer-impact-assessment-dtia).

## Customer Control

1mind offers an opt-out capability for customers who prefer that no IP address data be sent to 6sense for enrichment purposes. When opted out, no IP addresses are shared with 6sense and the customer's anonymous sessions do not receive 6sense-based company enrichment. Opt-out can be enabled for a customer on request.

## Frequently Asked Questions

**Does 6sense receive any personal data, such as individual names or emails?**

No. 6sense receives only IP address, timestamp, and a unique organization ID — sufficient for account-level matching, not individual-level correlation.

**Is 6sense used only for account/firmographic enrichment, or also for AI model training?**

6sense is used solely to enrich conversation records with company-level data (e.g., for CRM/marketing automation platform sync and attribution reporting). It is not used for AI model training.

**Does 6sense's processing involve automated profiling or decision-making with effects on individuals?**

No. The service provides company-level enrichment data only; it does not perform profiling or decision-making that affects individuals, and is not classified under any EU AI Act risk tier on that basis.

**Is there a cost, or any setup required?**

No. The integration is provided at no cost and requires no setup, code changes, or tracking pixel on the customer's site. This is an included benefit for being a 1mind customer.