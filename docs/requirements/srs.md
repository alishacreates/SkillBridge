# SkillBridge — Software Requirements Specification

**Version:** 0.1.0  
**Status:** Draft  
**Project:** SkillBridge  
**Reference:** SIH26044 — Smart India Hackathon 2026

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements for SkillBridge, an Academia–Industry Collaboration Platform for skill mapping, internships, placements, and professional development.

It serves as the requirements baseline for system architecture, database design, API development, implementation, and testing.

### 1.2 Scope

SkillBridge will connect students, academicians, industry organizations, and educational institutions through a unified digital platform.

The system will support the complete lifecycle of skill assessment, competency development, industry opportunity discovery, internships, placements, collaboration, and institutional monitoring.

### 1.3 Requirements Classification

Requirements are classified as:

- **Official-derived:** Derived directly from SIH26044.
- **Supporting:** Necessary to implement the official functionality reliably.
- **Enhancement:** Additional capabilities proposed specifically for SkillBridge.

All requirements will be linked to their source and verification evidence through the Requirements Traceability Matrix.

## 2. Stakeholders and Actors

| Actor | Responsibilities |
|---|---|
| Student | Skill development, portfolios, applications, internships |
| Academician | Faculty training, industry internships, research collaboration |
| Industry Organization | Opportunities, assessments, mentorship, recruitment |
| Recruiter | Candidate evaluation, shortlisting, application management |
| Institution | Student monitoring, placement coordination, analytics |
| Mentor | Internship supervision, feedback, progress evaluation |
| Administrator | Platform administration, governance, access management |

One person may have multiple authorized responsibilities. The final role and permission model will be defined during architecture design.

## 3. Functional Requirements

### 3.1 Identity and Access Management

**FR-001 — User Authentication**

The system shall authenticate registered users before granting access to protected functionality.

**FR-002 — Role-Based Authorization**

The system shall restrict access to protected operations based on authorized user roles and permissions.

### 3.2 Student Skill Development

**FR-003 — Student Profile Management**

Students shall be able to maintain academic details, career interests, and relevant professional information.

**FR-004 — Technical and Soft Skill Assessment**

Students shall be able to complete industry-relevant questionnaires and aptitude assessments.

**FR-005 — Skill Profiling**

The system shall generate and maintain student skill profiles using assessment outcomes and relevant competency information.

**FR-006 — Skill-Gap Identification**

The system shall identify gaps between student competencies and industry or career-role requirements.

**FR-007 — Career Guidance**

The system shall recommend relevant career roles and industry domains based on skills, interests, and industry requirements.

**FR-008 — Personalized Learning Recommendations**

The system shall recommend learning programs, certifications, workshops, and training opportunities aligned with identified skill gaps.

### 3.3 Digital Portfolio

**FR-009 — Student Digital Portfolio**

Students shall be able to maintain a portfolio of projects, certifications, internships, achievements, and competencies.

**FR-010 — Skill and Credential Verification**

The system shall support verification records for relevant skills, certifications, and achievements.

### 3.4 Industry Opportunities

**FR-011 — Opportunity Publishing**

Authorized industry users shall be able to publish internships, apprenticeships, live projects, and entry-level jobs with relevant skill and eligibility requirements.

**FR-012 — Opportunity Discovery**

Students shall be able to search and filter available opportunities.

**FR-013 — Opportunity Matching**

The system shall recommend suitable opportunities based on student skill profiles, career interests, and opportunity requirements.

**FR-014 — Internship and Job Applications**

Students shall be able to submit applications to eligible opportunities.

**FR-015 — Application Tracking**

Students shall be able to view the current status and history of their applications.

### 3.5 Recruitment and Placement

**FR-016 — Candidate Evaluation and Shortlisting**

Authorized recruiters shall be able to review candidates against skill requirements and eligibility criteria.

**FR-017 — Recruitment Workflow**

Recruiters shall be able to manage application stages and record recruitment outcomes.

**FR-018 — Placement Recommendations**

The system shall recommend relevant placement opportunities using candidate profiles and job requirements.

### 3.6 Internship Lifecycle

**FR-019 — Internship Progress Tracking**

The system shall record internship participation and progress.

**FR-020 — Mentor Feedback**

Authorized mentors shall be able to provide feedback on internship participation and performance.

**FR-021 — Internship Completion Records**

The system shall maintain internship completion information and relevant outcomes.

### 3.7 Industry Learning and Collaboration

**FR-022 — Industry Learning Programs**

Industry organizations shall be able to publish training programs, certification courses, and workshops.

**FR-023 — Mentorship Programs**

The system shall support mentorship opportunities and participation.

**FR-024 — Industry–Academia Collaboration**

The system shall support guest lectures, innovation challenges, live industry projects, and research partnerships.

### 3.8 Academician Opportunities

**FR-025 — Faculty Industry Opportunities**

Academicians shall be able to discover faculty internships, industrial training, Faculty Development Programs, and consultancy opportunities.

**FR-026 — Faculty Collaboration Participation**

Academicians shall be able to participate in relevant training, mentorship, and collaborative research opportunities.

### 3.9 Institutional Monitoring

**FR-027 — Student Development Monitoring**

Authorized institutions shall be able to monitor student skill development and assessment progress.

**FR-028 — Internship and Placement Monitoring**

Authorized institutions shall be able to monitor internship participation, placement readiness, and placement outcomes.

**FR-029 — Institutional and Industry Analytics**

The platform shall provide authorized stakeholders with analytics covering skill demand, readiness, recruitment outcomes, and participation trends.

### 3.10 Documents and Integrations

**FR-030 — Secure Document Management**

The system shall support controlled storage, retrieval, and access to resumes, certificates, internship reports, and academic records.

**FR-031 — External Platform Integration**

The system shall support integration with learning platforms, certification providers, and institutional databases through documented interfaces.

### 3.11 Platform Administration

**FR-032 — Platform Administration**

Authorized administrators shall be able to manage platform access and necessary governance operations.

## 4. Non-Functional Requirements

### NFR-001 — Security

The system shall protect credentials and sensitive data, validate untrusted inputs, and enforce authorization on protected resources.

### NFR-002 — Data Integrity

The system shall preserve referential integrity and transactional consistency for critical workflows.

### NFR-003 — Maintainability

The implementation shall follow documented module boundaries, coding conventions, and architecture decisions.

### NFR-004 — Reliability

Critical workflows shall include appropriate error handling, failure recovery, and automated verification.

### NFR-005 — Performance

The system shall support efficient data retrieval, filtering, pagination, and measured performance improvements.

### NFR-006 — Scalability

The architecture shall support incremental growth in users, opportunities, assessments, and application records.

### NFR-007 — Accessibility

The user interface shall support semantic markup, keyboard navigation, visible focus indicators, and accessible form feedback.

### NFR-008 — Usability

The system shall provide clear navigation, responsive layouts, and understandable feedback.

### NFR-009 — Observability

The application shall support operational diagnostics and meaningful error reporting without exposing sensitive information.

### NFR-010 — Testability

Critical business rules, API contracts, and user workflows shall be independently testable.

### NFR-011 — Privacy

The platform shall restrict access to student information, assessment results, and documents according to authorized responsibilities.

### NFR-012 — Interoperability

External integrations shall use documented interfaces and handle unavailable services gracefully.

## 5. Business Rules

The following are proposed rules requiring confirmation during detailed design.

**BR-001:** Users may perform only operations permitted by their roles and resource-level permissions.

**BR-002:** Students may modify only their own profiles unless an authorized administrative workflow permits otherwise.

**BR-003:** Recruiters may manage only opportunities belonging to their authorized organizations.

**BR-004:** Duplicate applications to the same opportunity shall be prevented unless a documented reapplication policy permits them.

**BR-005:** Recruitment status changes shall follow defined, valid transitions.

**BR-006:** Skill assessment results shall remain distinguishable from self-reported proficiency.

**BR-007:** Verification status shall identify the source and authority of verification.

**BR-008:** Institutional analytics shall respect access boundaries and student privacy.

## 6. Assumptions and Dependencies

- Industry skill requirements will be supplied by participating organizations or maintained through authorized platform workflows.
- External learning and certification integrations depend on provider availability and access.
- Institutions and organizations require an onboarding and authorization model.
- Verified credentials require a trusted verification process.
- The initial development environment may use synthetic data.
- Production-scale performance targets will require defined workloads and measurement.

## 7. Acceptance and Verification

Each functional requirement must have:

1. A unique requirement identifier.
2. A defined actor and preconditions.
3. Observable expected behavior.
4. Success and failure acceptance criteria.
5. An implementation reference.
6. Appropriate test evidence.

Detailed acceptance criteria and requirement-to-test mappings will be maintained in `traceability.md`.

## 8. Open Questions

- How will industry organizations and institutions be verified?
- Can one user belong to multiple organizations or hold multiple roles?
- Who is authorized to verify student skills and certifications?
- What is the minimum evidence required for a verified competency?
- How will mentors be assigned to internships?
- What constitutes successful internship completion?
- What information may institutions access about individual students?
- Which external platforms will support real integrations?
- How should matching balance required skills, proficiency, assessments, and interests?
- What measurable performance and availability targets should apply?

## 9. Change Management

Requirements changes shall be documented and reflected in the traceability matrix.

The original SIH26044 statement remains the authoritative external requirements source.

Any SkillBridge-specific enhancement shall be explicitly identified rather than represented as an official SIH requirement.