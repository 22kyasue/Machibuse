# NotebookLM Conversation Export
> Exported on 2026/3/9 20:32:50 — 1 turns

---

## NotebookLM

Here is a comprehensive initial project document you can save as a README.md or project_context.md file in your project folder. This will give Claude Code a perfect understanding of the application's core concepts, MVP scope, and database architecture based on your planning.

--------------------------------------------------------------------------------

Project Context & Product Requirements Document (PRD)
Important System Prompt for Claude Code: This application, including all UI elements, database text data, and user interactions, MUST be developed entirely in Japanese. The target market is the Japanese real estate sector.
1. Product Overview & Core Concept
Unlike traditional real estate apps (like SUUMO or Ken Corp) that only show currently available listings, this application is a "Stealth Watch" Real Estate OS
1
2
. It allows users to track specific buildings and unlisted floor plans, wait for them to hit the market, receive instant notifications, and eventually automate the viewing and application process
2
3
.
The core value is shifting the user experience from "searching for current inventory" to "tracking desired assets and acting instantly when they become available"
3
4
.
2. Phased Development Roadmap
V0 (MVP - Concept Validation): Focus on building the core database (buildings and room types) and the stealth watch notification system. Users can browse buildings, view floor plan types (even if currently occupied), and set up notifications for when those specific rooms become available
5
6
.
V1 (Usability): Introduce detailed search functions, past listing histories, comparison tools, and basic inquiry forms
7
8
.
V2 & Beyond (Automation): Implement "Smart Resume" (auto-filling application forms using pre-saved user profiles), one-click viewing reservations, and AI floor plan redrawing to avoid copyright issues
9
...
.
3. Core Database Schema (The "Unit Master" Concept)
The database must be structured around "Assets" (Buildings/Units) rather than "Advertisements" (Listings)
12
13
.
mansions (Building Master): Tracks all buildings regardless of active listings
14
.
Fields: mansion_id, name (normalized), address, brand_type, total_units, construction_date, features.
units (Room/Floor Plan Master): Crucial table. Tracks every room/layout in a building, even if currently occupied
14
.
Fields: unit_id, mansion_id, room_number, floor, size_sqm, layout_type, re-rendered_floorplan_url, last_rent.
listings (Current & Past Advertisements): Tracks the actual market availability
14
.
Fields: listing_id, unit_id, status (Active, Past, etc.), current_rent, management_fee, source_url, scraped_at.
user_watchlists (Notification Triggers):
15
.
Fields: watch_id, user_id, target_unit_id or target_mansion_id, conditions (JSON), notification_sent.
application_profiles (Smart Resume for V2):
15
.
Fields: user_id, personal_data (Encrypted), job_data (Encrypted), guarantor_data (Encrypted).
4. V0 MVP Scope & UI Architecture
For the initial build, Claude Code should focus ONLY on the following 6 core screens
16
:
Home/Dashboard: Overview of watched buildings and recent new listings
17
.
Building List (建物一覧): Browse registered buildings, showing current active listings and past confirmed floor plans
18
.
Building Detail (建物詳細): The central hub. Shows building info, a catalog of all known floor plan types (active or not), and a toggle to "Watch" the building
19
20
.
Floor Plan Detail (間取りタイプ詳細): Shows specific layout details, past rent history, and a toggle to "Watch" this specific unit type
21
22
.
Listing Detail (募集詳細): The actual current listing data when a room hits the market
22
.
Notification Inbox (通知一覧): History of newly detected listings or price changes
23
.
5. System Architecture Components
Data Pipeline: Web scrapers to monitor major portals and normalize building names to avoid duplicate data
24
.
Matching Engine: Scans user_watchlists against new listings and triggers push/email notifications instantly
25
.
Design Rule: Status labels (e.g., 募集中 / 過去掲載あり / 現在確認なし) must be prominently displayed as tags across the UI to help users understand context immediately
23
.

--------------------------------------------------------------------------------

Would you like me to help you define the specific tech stack (e.g., Next.js, Supabase, Python scrapers) to add to this document before you hand it over to Claude Code?

---
