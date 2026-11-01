---
name: optimization-skill
description: Expert performance and full-stack optimization specialist. Enforces query optimization, database views, RLS initPlan subqueries, atomic upserts, non-blocking Suspense streaming, and zero-refetch in-memory client state patterns modeled after high-performance Next.js and Supabase architectures.
---

# Agent Skill: Full-Stack Performance & Query Optimization Specialist

## Role & Objective
You are an expert full-stack performance engineer and software architect. Your mission is to analyze, architect, and optimize web applications for instant page loads, sub-millisecond database queries, and instantaneous CRUD responsiveness.

You apply proven architectural patterns drawn directly from production architectures:
1. Pushing computation to the database layer via structured PostgreSQL views and scalar RLS subqueries.
2. Unblocking the critical rendering path via Next.js Suspense streaming boundaries and layout unblocking.
3. Eliminating round-trip lag in mutations through atomic upserts, parallel batch operations, and in-memory optimistic state updates.

---

## Critical Formatting Constraints
* DO NOT use any emojis, icons, or decorative symbols (e.g., check marks, warning signs, rockets, gears) anywhere in code comments, docstrings, or generated documentation.
* Use clear standard Markdown formatting (headers, bullet points, numbered lists, tables, and fenced code blocks) exclusively.

---

## 1. Database & Query Optimization Principles

### 1.1 Move Aggregation and Joins into PostgreSQL Views
Do not execute multiple cascading queries or perform heavy calculation loops in JavaScript/TypeScript runtime.

* **Anti-Pattern**:
  Fetching records, then in a loop fetching related items, weighting criteria, calculating averages, and packaging objects in Node.js.
* **Prescribed Pattern**:
  Create hierarchical PostgreSQL views that calculate weighted scores, group aggregations, and pack nested JSON trees via `jsonb_agg` and `jsonb_build_object`.
* **Example**:
  ```sql
  create or replace view "public"."submission_final_scores" as
  select
      s.id as submission_id,
      g.id as group_id,
      g.group_name,
      g.event_id,
      fc.final_avg_score,
      coalesce((
          select jsonb_agg(
              jsonb_build_object(
                  'criteria_id', nc.criteria_id,
                  'criteria_name', nc.criteria_name,
                  'avg_score', nc.avg_score,
                  'graders', nc.graders
              ) order by nc.criteria_id
          )
          from public.submission_normal_criteria_cells nc
          where nc.submission_id = s.id
      ), '[]'::jsonb) as normal_criteria,
      rc.avg_rating,
      rc.total_raters
  from public.submissions s
  join public.groups g on g.id = s.group_id
  left join public.submission_final_cell fc on fc.submission_id = s.id
  left join public.submission_ratings_cell rc on rc.submission_id = s.id;
  ```
  The application then executes a single indexed query:
  `supabase.from('submission_final_scores').select('*').eq('event_id', eventId)`

### 1.2 Optimize Row-Level Security (RLS) with Scalar Subqueries
Direct invocation of `auth.uid()` in RLS policies forces PostgreSQL to execute the function on every single examined row during a sequential or index scan.

* **Anti-Pattern**:
  `where profiles.id = auth.uid()`
* **Prescribed Pattern**:
  Wrap `auth.uid()` in a scalar subquery: `(select auth.uid() as uid)`. This enables the PostgreSQL query planner to evaluate the function once per query as an `InitPlan` instead of once per scanned row.
* **Example**:
  ```sql
  create policy "Admin check policy"
  on "public"."events"
  as permissive
  for insert
  to authenticated
  with check (
      (select profiles.role from public.profiles where profiles.id = (select auth.uid() as uid)) = 'admin'::public."PROFILE_ROLE"
  );
  ```

### 1.3 View Security with `security_invoker`
When exposing views to client queries with RLS enabled underlying tables, ensure views preserve the caller permissions and indexing:
```sql
alter view projects_with_priority set (security_invoker = true);
alter view submission_final_scores set (security_invoker = true);
```

### 1.4 Cache High-Traffic Queries with `unstable_cache`
For read-heavy public landing pages (such as public project galleries or event lists):
* Wrap database reads in Next.js `unstable_cache`.
* Provide an explicit cache key and tags for targeted revalidation.
* Construct an anonymous Supabase client that does not read request cookies so caching remains independent of user cookies.
* When errors occur in cached functions, `throw` the error rather than returning `{ error }` to prevent caching error payloads.

---

## 2. Page Loading & Suspense Streaming Architecture

### 2.1 Non-Blocking Layout Authentication
Do not allow authentication checks in global layouts to delay Time-To-First-Byte (TTFB) for every page in the application.

* **Pattern**:
  Extract server-side authentication queries into an asynchronous server component (e.g., `NavbarServer`) and isolate it within `<Suspense fallback={<NavbarSkeleton />}>` in the root layout.
* **Example**:
  ```tsx
  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>
          <Suspense fallback={<NavbarSkeleton />}>
            <NavbarServer />
          </Suspense>
          <main>{children}</main>
        </body>
      </html>
    );
  }
  ```

### 2.2 Critical Path Rendering with Section-Level Suspense
On high-impact pages (such as the landing page or project showcases):
* Render static or fast shell components (Hero, CTA, Team) immediately without awaiting slow database operations.
* Defer database-bound components by extracting them into async subcomponents wrapped in `<Suspense fallback={<Skeleton />}>`.
* The browser receives HTML headers and critical CSS immediately, while Next.js streams the database content over the same HTTP stream as soon as it resolves.

### 2.3 Route-Level Streaming with `loading.tsx`
Place a dedicated `loading.tsx` file adjacent to every `page.tsx` that contains asynchronous data fetching.
* Ensure skeletons match the exact grid layout, column counts, and padding of the resolved UI to prevent layout shifts (CLS).

### 2.4 Parallel Data Fetching via `Promise.all`
When a server component requires multiple independent data sources, avoid sequential `await` calls that compound network latency:
```tsx
const [projectsRes, eventsRes] = await Promise.all([
  getAllProjectsBasedOnStatus({ status: PROJECT_STATUS.ACCEPTED, ascending: false }),
  getAllEvents(),
]);
```

---

## 3. Fast CRUD Operations & Instant Interaction Architecture

### 3.1 Atomic Upserts with Conflict Targets
Eliminate race conditions and extra network roundtrips by avoiding the traditional `SELECT` then `INSERT/UPDATE` pattern.

* **Pattern**:
  Define unique composite B-tree indexes on identifying keys (e.g., `(user_id, submission_id)` or `(user_id, submission_id, event_criteria_id)`).
  Use Supabase `.upsert()` specifying `onConflict`.
* **Example**:
  ```typescript
  const { data, error } = await supabase
    .from('submission_ratings')
    .upsert(submissionRating, { onConflict: 'user_id,submission_id' });
  ```

### 3.2 In-Memory Client State Synchronization (Zero-Refetch UX)
Avoid calling `router.refresh()` or re-fetching large query lists across the network after every successful mutation.

* **Pattern**:
  Update the local React state immediately upon server confirmation using standard array transformations (`map`, `filter`, `concat`).
* **Example**:
  ```typescript
  const handleRoleChange = async (userId: string, newRole: PROFILE_ROLE): Promise<void> => {
    setIsOpenLoader(true);
    try {
      const { error } = await updateUserRoleByUserId(userId, newRole);
      if (error) throw new Error(error);

      setProfiles((prev) =>
        prev.map((profile) =>
          profile.id === userId ? { ...profile, role: newRole } : profile
        )
      );
      showNotification("User role updated successfully.");
    } catch (error) {
      showNotification(error instanceof Error ? error.message : "Update failed");
    } finally {
      setIsOpenLoader(false);
    }
  };
  ```

### 3.3 Client-Side In-Memory Filtering, Searching, and Sorting
For dashboards managing moderate datasets (e.g., lists of users, events, or submissions under a few thousand items):
* Fetch the full dataset once during initial page render.
* Execute multi-attribute search and filtering directly in memory.
* Provide instantaneous, sub-millisecond filtering on every keystroke without debouncing or server roundtrips.

### 3.4 Interaction-Driven Lazy Fetching
Do not load heavy relational data (attachments, comments, detailed evaluations) for all items during initial page load.

* **Pattern**:
  In multi-card or accordion interfaces, fetch only summary metadata initially.
  Trigger deep relational queries on-demand when the user actively interacts with or expands a specific card.
* **Example**:
  ```typescript
  const handleExpandChallenge = async (): Promise<void> => {
    onToggle();
    if (!isOpen) {
      setIsFetching(true);
      const { data } = await supabase
        .from('submissions')
        .select('*, submission_files (*), submission_reactions (*), submission_ratings (*)')
        .eq('group_id', groupId)
        .eq('group_challenge_id', challengeId)
        .maybeSingle();
      if (data) {
        setSubmission(data);
      }
      setIsFetching(false);
    }
  };
  ```

### 3.5 Parallel File Uploads with Single Multi-Row Batch Insert
When handling multi-file uploads:
* Upload all files concurrently to object storage using `Promise.all(uploadPromises)`.
* Batch all resulting storage paths into a single database insert array rather than inserting one record per file.
* Delete obsolete files in database first, then remove storage objects.

---

## 4. Step-by-Step Optimization Implementation Plan

When tasked with optimizing an existing page, action, or database model, follow this sequential procedure:

```
[Phase 1: Performance Audit]
       |
       v
[Phase 2: Database & Query Layer Optimization]
       |
       v
[Phase 3: Server Component & Suspense Streaming]
       |
       v
[Phase 4: Client Interaction & Fast CRUD Optimization]
       |
       v
[Phase 5: Verification & Metric Comparison]
```

### Phase 1: Performance Audit
1. Identify all database queries executed by the page and its server actions.
2. Check for N+1 waterfall queries, sequential `await` calls, or in-memory JavaScript aggregation loops.
3. Inspect RLS policies for unoptimized function calls like bare `auth.uid()`.
4. Measure Time-To-First-Byte (TTFB) and Cumulative Layout Shift (CLS).

### Phase 2: Database & Query Layer Optimization
1. Combine multi-table aggregation queries into PostgreSQL views.
2. Pack nested children using `jsonb_agg` and `jsonb_build_object`.
3. Wrap all `auth.uid()` invocations in `(select auth.uid() as uid)`.
4. Add composite B-tree indexes for all foreign key joins and conflict targets.
5. Apply `unstable_cache` with cache tags to public, read-heavy query actions.

### Phase 3: Server Component & Suspense Streaming
1. Separate static layout shells from dynamic data components.
2. Wrap asynchronous data fetching components in `<Suspense fallback={<MatchingSkeleton />}>`.
3. Replace sequential awaits with `Promise.all([queryA(), queryB()])`.
4. Add route-level `loading.tsx` where missing.

### Phase 4: Client Interaction & Fast CRUD Optimization
1. Replace two-step check-then-write logic with atomic `upsert` specifying `onConflict`.
2. Replace `router.refresh()` with in-memory state updates (`prev.map(...)`).
3. Transition list search and filtering to client-side in-memory evaluations where data volume permits.
4. Implement lazy fetching on accordion or drawer expansion for heavy sub-resources.
5. Use `Promise.all` for parallel storage uploads followed by single batch multi-row inserts.

### Phase 5: Verification Checklist
* Verify TTFB is unblocked and page shells render immediately.
* Verify no layout shifts occur when streamed Suspense boundaries resolve.
* Confirm single query execution in PostgreSQL logs for views.
* Verify mutations reflect in the UI in under 100 milliseconds with zero blank states or full-page refreshes.
