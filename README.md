# United Shades OS

### Architecture Reference (MVP-First)

**Tech Stack:** Next.js + NestJS + PostgreSQL + Prisma + S3 + Twilio +
BullMQ/Redis\
**Prepared:** February 26, 2026

---

## Purpose

United Shades OS is a build-from-scratch CRM and operations system
designed specifically for a real tinting workflow.

Inspired by TintWiz/OrbisX --- but scoped for:

- A solo developer
- A real-world tint business
- Clean architecture
- MVP-first delivery

The goal is to ship a usable internal system first: - CRM - Jobs -
Photos - Texting - Inventory - Automations

Then scale cleanly later.

---

## Guiding Principles

- MVP-first → Deliver daily business value fast.
- Separation of concerns → Web UI, API, and Worker are distinct.
- Provider-agnostic messaging → Twilio wrapped behind
  MessagingService.
- Object storage for files → S3/R2 for photos and PDFs.
- Observable automations → Log everything (webhooks, messages, jobs).

---

## Recommended Stack

Layer Technology Why

---

Frontend Next.js + Tailwind Fast UI iteration, strong ecosystem
Backend NestJS (TypeScript) Structured modules, scalable
Database PostgreSQL Perfect for relational CRM data
ORM Prisma Type-safe queries, smooth DX
Auth Auth.js or Clerk Control (Auth.js) or speed (Clerk)
File Storage AWS S3 / Cloudflare R2 Durable + cheap
Messaging Twilio Messaging Service Reliable SMS/MMS
Background Jobs BullMQ + Redis Scheduling + retries
Hosting Vercel + Render/Railway Easy deploy + scale

---

## System Architecture

    Browser (Next.js)
            |
            | HTTPS (JWT/session)
            v
    API Server (NestJS)
     - Auth / RBAC
     - CRUD (customers, vehicles, jobs, inventory)
     - S3 pre-signed upload URLs
     - Twilio send endpoints
     - Twilio webhooks
     - Audit logs
            |
            | enqueue jobs (Redis)
            v
    Worker (BullMQ)
     - Appointment reminders
     - Follow-ups
     - Inventory checks
     - Retries/backoff
            |
            v
    External Services
     - Twilio
     - S3 / R2
     - AI API (future)

Data Stores: - Postgres → Business data + relationships - Redis →
Queue + scheduled jobs

---

## Monorepo Layout

    unitedshades-os/
      apps/
        web/        # Next.js frontend
        api/        # NestJS backend
        worker/     # BullMQ worker
      packages/
        db/         # Prisma schema + migrations
        shared/     # Shared types + zod schemas
      infra/
        docker/     # postgres + redis
        scripts/    # setup + seed scripts

---

## Core Modules (NestJS)

Module Responsibility

---

Auth Login, JWT, roles, permissions
Customers CRUD, phone normalization, search
Vehicles Tied to customers, notes, VIN optional
Jobs Work orders, scheduling, totals
Photos S3 uploads + metadata
Messaging Twilio send/inbound + threads
Automations Rules + worker enqueue
Inventory Stock, movements, thresholds
Admin Templates + business settings

---

## Database Model (MVP)

Store structured business data in Postgres.\
Store photos in S3 and keep keys + relationships in Postgres.

### Suggested Tables

Users / Roles: - users - roles - user_roles

CRM: - customers - vehicles - jobs - job_line_items - job_notes

Photos: - job_photos (job_id, customer_id, s3_key, url, tags,
created_at)

Messaging: - message_templates - message_threads - messages -
webhook_events

Inventory: - inventory_items - inventory_lots (optional) -
inventory_movements

Automations: - automation_rules - scheduled_tasks (optional)

---

## Messaging Flows (Twilio)

Outbound: UI → API /messages/send → Twilio → status callback → API
webhook → update message status

Inbound: Customer SMS → Twilio → API webhook → thread lookup → store
message → notify UI

Best Practices: - Use Twilio Messaging Service - Verify webhook
signatures - Persist Twilio SID - Log webhook payloads for debugging

---

## Automations (BullMQ + Redis)

When a job is scheduled: - Enqueue reminders (24h + 2h before)

Worker: - Sends SMS - Updates DB - Logs events

Example Queue Jobs: - reminder:job:{jobId}:24h -
reminder:job:{jobId}:2h - followup:job:{jobId} - inventory:nightly-check

---

## MVP Build Plan

Phase What Ships Outcome

---

1 Monorepo + Auth + Customers + Jobs Run daily job workflow
2 S3 uploads + photo galleries Attach photos to jobs
3 Twilio send + inbound threads Texting inside app
4 BullMQ automations Auto reminders
5 Inventory tracking Low-stock alerts
6 AI (optional) Reorder suggestions + drafts

---

## Key Implementation Notes

- Normalize phones to E.164 (+1XXXXXXXXXX)
- Keep S3 objects private
- Implement RBAC from day one
- Store webhook payloads
- Unit test messaging + inventory logic
- Integration test webhooks

---

## Project Goal

United Shades OS is not just a CRM.

It is: - A job management system - A messaging center - A photo
documentation system - An inventory tracker - An automation engine - A
scalable foundation for future AI integration

Built lean.\
Built clean.\
Built for real-world tint operations.
