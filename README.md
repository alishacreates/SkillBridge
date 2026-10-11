 <div align="center">

# SkillBridge

### Bridging Academic Skills and Industry Opportunities

**An Academia–Industry Skill Intelligence & Opportunity Matching Platform**

Based on **Smart India Hackathon 2026 — Problem Statement SIH26044**

![Status](https://img.shields.io/badge/Status-Planning-6366F1?style=flat-square)
![Category](https://img.shields.io/badge/Category-Software-540D6E?style=flat-square)
![License](https://img.shields.io/badge/License-TBD-64748B?style=flat-square)

*Connecting what students learn with what industry needs.*

---

**Overview** · **Problem** · **Features** · **Architecture** · **Engineering** · **Roadmap**

</div>

## Overview

SkillBridge is a full-stack platform designed to bridge the gap between academic learning and industry expectations.

The platform aims to connect **students, recruiters, academic institutions, and faculty** through a unified ecosystem for skill assessment, competency mapping, internship discovery, recruitment, professional development, and institutional collaboration.

Rather than functioning solely as a job portal, SkillBridge focuses on understanding **what students know, what industry requires, and how to close the gap**.

> **Project status:** Requirements and system design are being developed. The application is being rebuilt from scratch with an emphasis on software engineering fundamentals, maintainability, and testability.

## Problem Statement

**Smart India Hackathon 2026 — SIH26044**

**Title:** Portal for Academia–Industry Collaboration for Skill Mapping, Internships and Placement

**Organization:** Ministry of Ayush — All India Institute of Ayurveda

Academic institutions and industries frequently operate with limited visibility into each other's capabilities and requirements.

Students may struggle to identify the competencies needed for their desired roles, while recruiters face challenges finding candidates with relevant skills. Institutions also need better visibility into student readiness, industry expectations, and placement outcomes.

SkillBridge aims to address this through an integrated system supporting:

- Student skill profiling and competency assessments
- Skill-gap identification and personalized learning recommendations
- Internship, apprenticeship, project, and job opportunities
- Explainable student–opportunity matching
- Recruitment and application tracking
- Faculty–industry collaboration
- Digital portfolios and institutional analytics

The project is based on the official SIH problem statement and will be implemented incrementally against documented requirements.

## Core Platform Modules

| Module | Planned capabilities |
|---|---|
| Student | Academic profiles, skills, projects, certifications, career goals |
| Skill Intelligence | Assessments, skill mapping, readiness, gap analysis |
| Opportunity Discovery | Internship and job listings, eligibility, recommendations |
| Recruitment | Candidate discovery, shortlisting, application workflows |
| Industry Learning | Training programs, workshops, mentorship opportunities |
| Academia Collaboration | Faculty development, industrial training, research partnerships |
| Institutional Analytics | Skill-demand trends, readiness, placement monitoring |
| Administration | Role management, platform governance, controlled access |

All modules listed above are **planned**, not yet implemented.

## Proposed System Architecture

The initial architecture is planned as a modular monolith with a separate frontend and backend.

```text
                     CLIENT
                       |
                       v
              Next.js + TypeScript
                       |
                    REST API
                       |
                       v
              Express + TypeScript
                       |
              Application Services
                       |
                  Prisma ORM
                       |
                  PostgreSQL
```

The architecture will be reviewed against the complete requirements specification before implementation.

### Proposed Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| UI | Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| Testing | Vitest, Supertest, Playwright |
| Deployment | To be determined |

Technology selections are provisional until the corresponding architectural decisions are documented.

## Engineering Approach

SkillBridge follows a requirements-first, incremental engineering process.

```text
Requirements
     |
     v
Architecture & Design
     |
     v
Implementation
     |
     v
Automated Testing
     |
     v
Code Review
     |
     v
Documentation & Verification
```

### Engineering Principles

- **Correctness:** Implement behavior against explicit acceptance criteria.
- **Security:** Validate inputs and enforce authorization at trust boundaries.
- **Maintainability:** Separate concerns and favor cohesive modules.
- **Data integrity:** Use relational constraints and transactions where appropriate.
- **Testability:** Verify business logic and critical workflows.
- **Accessibility:** Build keyboard-accessible, semantic interfaces.
- **Performance:** Measure bottlenecks before optimizing.
- **Simplicity:** Avoid unnecessary infrastructure and premature abstraction.

## Documentation

The repository will maintain documentation for requirements, architecture, engineering decisions, and verification.

| Document | Purpose |
|---|---|
| `docs/requirements/problem-statement.md` | Official problem context and project interpretation |
| `docs/requirements/srs.md` | Functional and non-functional requirements |
| `docs/requirements/traceability.md` | Requirements-to-implementation tracking |
| `docs/architecture/system-design.md` | Architecture and component boundaries |
| `docs/architecture/database-design.md` | Relational model and constraints |
| `docs/engineering/standards.md` | Project-wide engineering conventions |
| `docs/decisions/` | Architecture decision records |
| `docs/roadmap.md` | Milestones and implementation progress |

Documents will be added and updated as the project evolves.

## Development Roadmap

- [ ] Requirements analysis and SIH traceability
- [ ] Architecture and database design
- [ ] Repository and development environment setup
- [ ] Authentication and role-based access control
- [ ] Student profiles and skill management
- [ ] Recruiter and opportunity management
- [ ] Skill assessments and competency mapping
- [ ] Explainable matching and skill-gap analysis
- [ ] Applications and recruitment workflow
- [ ] Industry learning and mentorship
- [ ] Faculty–industry collaboration
- [ ] Institutional dashboards and analytics
- [ ] Automated testing and security review
- [ ] Deployment and monitoring

## Current Status

**Planning and requirements engineering**

This repository is being developed from scratch. Features will be marked complete only after implementation and verification.

Setup and contribution instructions will be added when the application foundation is established.

## Project Origin

SkillBridge is an independent implementation based on **Smart India Hackathon 2026 Problem Statement SIH26044**.

The project is not presented as an official government deployment, an endorsed SIH solution, or a hackathon-winning submission.

---

<div align="center">

**SkillBridge — Learn. Validate. Match. Grow.**

Built with an emphasis on thoughtful software engineering.

</div>
