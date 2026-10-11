# SkillBridge — Database Design

**Database:** PostgreSQL  
**ORM:** Prisma  
**Status:** Conceptual design

## 1. Design Objectives

The database must support students, academicians, institutions, organizations, skills, opportunities, assessments, applications, collaboration, and analytics.

The model should preserve data integrity and avoid unnecessary duplication.

## 2. Proposed Domain Entities

### Identity and Organizations

- User
- Role / Permission
- Organization
- OrganizationMembership
- Institution
- StudentProfile
- AcademicianProfile
- RecruiterProfile

### Skills and Assessments

- Skill
- StudentSkill
- SkillAssessment
- AssessmentQuestion
- AssessmentAttempt
- AssessmentResponse
- RoleSkillRequirement
- SkillVerification

### Opportunities and Recruitment

- Opportunity
- OpportunitySkill
- Application
- ApplicationStatusHistory
- RecruitmentEvaluation

### Internships

- InternshipEnrollment
- InternshipProgress
- MentorAssignment
- MentorFeedback
- InternshipCompletion

### Learning and Collaboration

- LearningProgram
- LearningEnrollment
- MentorshipProgram
- MentorshipParticipation
- CollaborationProject
- CollaborationParticipation
- FacultyOpportunity

### Portfolios and Documents

- PortfolioProject
- Certification
- Achievement
- Document
- DocumentAccess

This is a conceptual inventory, not the final Prisma schema. Some entities may be consolidated or refined after domain modeling.

## 3. Core Relationships

```text
User
 |
 +-- StudentProfile
 |       |
 |       +-- StudentSkill -- Skill
 |       |
 |       +-- Application -- Opportunity
 |       |
 |       +-- AssessmentAttempt
 |       |
 |       +-- PortfolioProject
 |
 +-- OrganizationMembership -- Organization
                                  |
                                  +-- Opportunity
                                  |
                                  +-- LearningProgram
                                  |
                                  +-- CollaborationProject

Opportunity
 |
 +-- OpportunitySkill -- Skill
 |
 +-- Application
```

## 4. Relational Design Rules

- Use UUID primary keys where appropriate.
- Define explicit foreign keys.
- Enforce meaningful uniqueness constraints.
- Use join tables for many-to-many relationships with additional attributes.
- Store timestamps consistently.
- Use transactions for atomic multi-record operations.
- Avoid duplicated derived data unless justified.
- Use indexes based on actual query patterns.

## 5. Important Constraints

Examples of proposed constraints:

- User email must be unique under the chosen normalization policy.
- StudentSkill must not duplicate the same skill for one student.
- OpportunitySkill must not duplicate a skill requirement.
- Duplicate active applications must follow a defined reapplication policy.
- Assessment scores must remain within valid bounds.
- Recruiter operations must respect organization ownership.

## 6. Transactions

Transactions will be considered for workflows such as:

- User and profile creation
- Application submission with related records
- Recruitment state changes with history
- Internship completion and associated records
- Credential verification updates

## 7. Indexing

Potential query patterns include:

- Opportunities by status and deadline
- Applications by student
- Applications by opportunity and status
- Skills by canonical name
- Assessments by student and date
- Organization-specific opportunities

Indexes will be finalized after query design.

## 8. Deletion and Retention

Deletion policies require careful review.

Sensitive academic records, verified credentials, and recruitment history should not be deleted through unrestricted cascading operations.

Retention, archival, anonymization, and deletion requirements will be specified before implementing sensitive-data workflows.

## 9. Migrations

All schema changes must use version-controlled Prisma migrations.

Production data must not be modified through destructive schema synchronization.

## 10. Next Step

Convert this conceptual design into a reviewed ER diagram and Prisma schema during the database implementation milestone.