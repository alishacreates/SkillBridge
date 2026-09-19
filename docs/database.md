# Database

The database is PostgreSQL, modeled by `backend/prisma/schema.prisma` and accessed
through Prisma 7.10.0. Moving the backend under `backend/` does not change this
schema.

## Main entities

- `User` owns one optional `StudentProfile` and one optional `RecruiterProfile`.
- `StudentProfile` records education and career targets. It relates to skills through
  `StudentSkill`, to opportunities through `Application`, and to `Assessment` rows.
- `RecruiterProfile` owns `Opportunity` rows.
- `Skill` is a normalized skill catalog. `StudentSkill` and `OpportunitySkill` are
  explicit junction models; skills are not stored as arrays or repeated strings.
- `Opportunity` stores role details, status, deadline, and matching requirements.
- `Application` links one student to one opportunity and tracks lifecycle status and
  optional match/application timestamps.
- `LearningResource` belongs to one skill and uses the `DifficultyLevel` enum.

## Relationships and deletion

Foreign keys cascade updates and deletes from their owning records. Deleting a user
removes its profile; profile removal cascades to owned skills, applications,
assessments, or opportunities; opportunity and skill removal cascades to their join
rows and dependent resources.

## Constraints

- Unique: `User.email`, `Skill.name`, both profile `userId` fields.
- Composite unique: `StudentSkill(studentId, skillId)`,
  `OpportunitySkill(opportunityId, skillId)`, and
  `Application(studentId, opportunityId)`.
- UUID primary/foreign keys and timezone-aware timestamps are used throughout.
- CGPA, stipend, match/assessment scores, and opportunity-skill weights use fixed
  PostgreSQL decimal types. Allowed numeric ranges belong in future Zod/service
  validation, not Prisma schema constraints.

## Important indexes

Indexes support user-role and creation-time lookup, profile graduation/target-role
filters, skill categories, student/opportunity skill joins, active opportunity
deadline queries, application status/history queries, assessment history, and
learning-resource difficulty lookup. Composite uniqueness indexes also support the
leading foreign-key lookups for their junction tables.

Migration and generation commands are documented in `docs/setup.md`.
