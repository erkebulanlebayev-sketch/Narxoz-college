# Complete Database Schema Migration

## Overview

This document describes the complete database schema migration for the Narxoz College Management System. The migration creates all missing tables with proper Row Level Security (RLS) policies, real-time replication, and performance indexes.

## What Was Created

### New Tables

1. **news** - News articles and announcements
2. **schedule** - Class schedule entries  
3. **library_books** - Library book catalog with availability tracking
4. **materials** - Teaching materials and student submissions (enhanced)
5. **settings** - System configuration settings
6. **audit_log** - Audit trail for all significant system actions

### Features Implemented

✅ **Row Level Security (RLS)** - All tables have comprehensive RLS policies
✅ **Real-Time Replication** - All tables (except audit_log) enabled for real-time sync
✅ **Performance Indexes** - Strategic indexes on frequently queried columns
✅ **Auto-Timestamps** - Automatic updated_at column updates via triggers
✅ **Data Integrity** - Foreign key constraints and check constraints
✅ **Audit Trail** - Immutable audit log with no update/delete policies

## How to Deploy

### Step 1: Run the Migration Script

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the entire contents of `supabase-complete-schema.sql`
5. Paste into the SQL Editor
6. Click **Run** to execute

### Step 2: Verify Deployment

Run these verification queries in the SQL Editor:

```sql
-- Verify tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('news', 'schedule', 'library_books', 'materials', 'settings', 'audit_log');

-- Verify RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('news', 'schedule', 'library_books', 'materials', 'settings', 'audit_log');

-- Verify real-time is enabled
SELECT schemaname, tablename FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

Expected results:
- 6 tables should be listed
- All tables should have `rowsecurity = true`
- 5 tables should be in real-time publication (all except audit_log)

## Table Details

### 1. News Table

**Purpose**: Store news articles and announcements

**Columns**:
- `id` - Primary key
- `title` - Article title
- `content` - Article content (supports rich text)
- `author_id` - Reference to auth.users
- `author_name` - Author display name
- `published` - Publication status (true/false)
- `image_url` - Optional article image
- `category` - Article category
- `created_at`, `updated_at` - Timestamps

**RLS Policies**:
- SELECT: Everyone can read published news; admins can read all
- INSERT/UPDATE/DELETE: Only admins

**Real-Time**: ✅ Enabled

**Indexes**:
- `idx_news_published` - Filter by publication status
- `idx_news_category` - Filter by category
- `idx_news_created_at` - Sort by date (DESC)
- `idx_news_author` - Filter by author

### 2. Schedule Table

**Purpose**: Store class schedule entries

**Columns**:
- `id` - Primary key
- `day_of_week` - 0=Monday through 6=Sunday
- `start_time` - Class start time
- `end_time` - Class end time
- `subject` - Subject name
- `teacher_id` - Reference to teachers table
- `group_name` - Student group
- `room` - Room number/name
- `created_at`, `updated_at` - Timestamps

**RLS Policies**:
- SELECT: Everyone can read
- INSERT/UPDATE/DELETE: Only admins

**Real-Time**: ✅ Enabled

**Indexes**:
- `idx_schedule_day` - Filter by day of week
- `idx_schedule_teacher` - Filter by teacher
- `idx_schedule_group` - Filter by group
- `idx_schedule_time` - Sort by time

### 3. Library Books Table

**Purpose**: Track library books and their availability

**Columns**:
- `id` - Primary key
- `title` - Book title
- `author` - Book author
- `isbn` - ISBN (unique)
- `category` - Book category
- `description` - Book description
- `cover_url` - Book cover image URL
- `status` - available, occupied, or reserved
- `borrowed_by` - Reference to students table
- `borrowed_at` - Borrow timestamp
- `due_date` - Return due date
- `created_at`, `updated_at` - Timestamps

**RLS Policies**:
- SELECT: Everyone can read
- INSERT/UPDATE/DELETE: Only admins

**Real-Time**: ✅ Enabled

**Indexes**:
- `idx_library_category` - Filter by category
- `idx_library_status` - Filter by availability
- `idx_library_borrowed_by` - Find books by borrower
- `idx_library_title` - Search by title
- `idx_library_author` - Search by author

### 4. Materials Table

**Purpose**: Store teaching materials and student submissions

**Columns**:
- `id` - Primary key
- `title` - Material title
- `description` - Material description
- `subject` - Subject name
- `category` - notes, homework, projects, exams, teaching
- `file_url` - File storage URL
- `file_name` - Original filename
- `file_size` - File size in bytes
- `uploader_id` - Reference to auth.users
- `uploader_name` - Uploader display name
- `uploader_role` - student or teacher
- `group_name` - Target group (optional)
- `created_at` - Upload timestamp

**RLS Policies**:
- SELECT: Everyone can read
- INSERT: Teachers, students, and admins
- UPDATE/DELETE: Owner or admin only

**Real-Time**: ✅ Enabled

**Indexes**:
- `idx_materials_subject` - Filter by subject
- `idx_materials_category` - Filter by category
- `idx_materials_uploader` - Filter by uploader
- `idx_materials_group` - Filter by group
- `idx_materials_created_at` - Sort by date (DESC)

### 5. Settings Table

**Purpose**: Store system configuration settings

**Columns**:
- `id` - Primary key
- `key` - Setting key (unique)
- `value` - Setting value (JSONB)
- `description` - Setting description
- `updated_at` - Last update timestamp

**RLS Policies**:
- SELECT: Everyone can read
- INSERT/UPDATE/DELETE: Only admins

**Real-Time**: ✅ Enabled

**Indexes**:
- `idx_settings_key` - Lookup by key

**Initial Data**:
```json
{
  "key": "grade_submission_window",
  "value": {
    "enabled": true,
    "deadline": null,
    "message": "Grade submission is currently open"
  }
}
```

### 6. Audit Log Table

**Purpose**: Immutable audit trail for system actions

**Columns**:
- `id` - Primary key
- `user_id` - Reference to auth.users
- `user_email` - User email
- `user_role` - User role at time of action
- `action` - create, update, delete, login, logout, access_denied
- `table_name` - Affected table
- `record_id` - Affected record ID
- `old_data` - Previous data (JSONB)
- `new_data` - New data (JSONB)
- `ip_address` - User IP address
- `user_agent` - User agent string
- `created_at` - Action timestamp

**RLS Policies**:
- SELECT: Only admins can read
- INSERT: Anyone (system logging)
- UPDATE/DELETE: **Denied** (immutable log)

**Real-Time**: ❌ Disabled (security)

**Indexes**:
- `idx_audit_user` - Filter by user
- `idx_audit_action` - Filter by action type
- `idx_audit_table` - Filter by table
- `idx_audit_created_at` - Sort by date (DESC)

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled with role-based policies:

**Admin Role**:
- Full access to all tables
- Can create, read, update, delete all records

**Teacher Role**:
- Can read all data
- Can insert/update/delete materials
- Can insert/update/delete grades (via existing grades table)

**Student Role**:
- Can read all data (except unpublished news)
- Can insert/update/delete their own materials
- Cannot modify system data

### Audit Log Integrity

The audit_log table has **no UPDATE or DELETE policies**, making it immutable. Only INSERT and SELECT operations are allowed, ensuring the audit trail cannot be tampered with.

## Performance Optimization

### Strategic Indexes

Indexes are created on:
- Foreign key columns (for JOIN performance)
- Filter columns (status, category, published)
- Sort columns (created_at, start_time)
- Search columns (title, author)

### Real-Time Optimization

Real-time replication is enabled only for tables that need it:
- ✅ news, schedule, library_books, materials, settings
- ❌ audit_log (security - no need for real-time audit viewing)

## TypeScript Interfaces

### News Interface

```typescript
interface News {
  id: number;
  title: string;
  content: string;
  author_id?: string;
  author_name: string;
  published: boolean;
  image_url?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}
```

### Schedule Interface

```typescript
interface Schedule {
  id: number;
  day_of_week: number; // 0-6
  start_time: string;
  end_time: string;
  subject: string;
  teacher_id: number;
  group_name: string;
  room: string;
  created_at: string;
  updated_at: string;
}
```

### LibraryBook Interface

```typescript
interface LibraryBook {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  category: string;
  description?: string;
  cover_url?: string;
  status: 'available' | 'occupied' | 'reserved';
  borrowed_by?: number;
  borrowed_at?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}
```

### Material Interface

```typescript
interface Material {
  id: number;
  title: string;
  description?: string;
  subject: string;
  category: 'notes' | 'homework' | 'projects' | 'exams' | 'teaching';
  file_url: string;
  file_name: string;
  file_size: number;
  uploader_id: string;
  uploader_name: string;
  uploader_role: 'student' | 'teacher';
  group_name?: string;
  created_at: string;
}
```

### Setting Interface

```typescript
interface Setting {
  id: number;
  key: string;
  value: any; // JSONB
  description?: string;
  updated_at: string;
}

// Grade submission window setting
interface GradeSubmissionSetting {
  enabled: boolean;
  deadline?: string; // ISO timestamp
  message?: string;
}
```

### AuditLog Interface

```typescript
interface AuditLog {
  id: number;
  user_id?: string;
  user_email: string;
  user_role: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'access_denied';
  table_name?: string;
  record_id?: number;
  old_data?: any;
  new_data?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}
```

## Usage Examples

### Creating News Article

```typescript
const { data, error } = await supabase
  .from('news')
  .insert({
    title: 'Welcome to Narxoz',
    content: 'We are excited to announce...',
    author_id: user.id,
    author_name: user.name,
    published: true,
    category: 'announcements'
  });
```

### Querying Schedule

```typescript
// Get schedule for a specific group
const { data, error } = await supabase
  .from('schedule')
  .select('*, teachers(name)')
  .eq('group_name', 'ИС-21-1')
  .order('day_of_week', { ascending: true })
  .order('start_time', { ascending: true });
```

### Checking Book Availability

```typescript
const { data, error } = await supabase
  .from('library_books')
  .select('*')
  .eq('status', 'available')
  .order('title');
```

### Logging Audit Event

```typescript
const { error } = await supabase
  .from('audit_log')
  .insert({
    user_id: user.id,
    user_email: user.email,
    user_role: user.role,
    action: 'create',
    table_name: 'news',
    record_id: newsId,
    new_data: newsData,
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
  });
```

### Real-Time Subscription

```typescript
// Subscribe to news updates
const channel = supabase
  .channel('news-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'news' },
    (payload) => {
      console.log('News updated:', payload);
      // Update UI
    }
  )
  .subscribe();
```

## Next Steps

After deploying this schema:

1. ✅ **Task 1 Complete** - Database schema and RLS policies created
2. ⏭️ **Task 1.1** - Write property tests for database schema
3. ⏭️ **Task 2** - Implement audit logging system
4. ⏭️ **Task 3** - Implement news management system
5. ⏭️ **Task 5** - Implement schedule management system
6. ⏭️ **Task 6** - Implement library management system

## Troubleshooting

### Issue: Tables already exist

If you see "table already exists" errors, you can either:
1. Drop the existing tables first (⚠️ **WARNING: This deletes all data**)
2. Use `CREATE TABLE IF NOT EXISTS` (already in the script)

### Issue: RLS policies conflict

If you see "policy already exists" errors:
```sql
-- Drop existing policies first
DROP POLICY IF EXISTS "policy_name" ON public.table_name;
```

### Issue: Real-time not working

Verify real-time is enabled:
```sql
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

If missing, manually add:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.table_name;
```

## Requirements Validated

This migration satisfies the following requirements:

- ✅ **Requirement 3.1** - Schedule creation and storage
- ✅ **Requirement 4.1** - News article creation and storage
- ✅ **Requirement 6.1** - Grade submission window control (settings table)
- ✅ **Requirement 8.1** - Library book management
- ✅ **Requirement 9.1** - Materials file storage with metadata
- ✅ **Requirement 15.1** - Audit logging for all actions

