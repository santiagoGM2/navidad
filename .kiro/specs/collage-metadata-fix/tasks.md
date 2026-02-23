# Collage Metadata & Sync Fix - Implementation Tasks

## 📋 Task Overview

Este plan de implementación está organizado en fases secuenciales para minimizar riesgos y facilitar validación incremental.

---

## Phase 1: Database Migration & Setup

### Task 1.1: Create Database Migration Script
- [ ] 1.1.1 Create SQL migration file in `supabase/` directory
- [ ] 1.1.2 Add new columns: `fecha_captura`, `hora_captura`, `timezone`, `ubicacion`, `tamano_optimizado`, `formato_final`
- [ ] 1.1.3 Migrate existing data: set `fecha_captura = fecha_subida` where null
- [ ] 1.1.4 Create index on `fecha_captura` for efficient sorting
- [ ] 1.1.5 Add verification query to confirm migration success

**Details:**
- File: `supabase/collage-metadata-migration.sql`
- Must be idempotent (safe to run multiple times)
- Must not break existing data

### Task 1.2: Execute Database Migration
- [ ] 1.2.1 Backup current `collage_recuerdos` table
- [ ] 1.2.2 Execute migration script in Supabase Dashboard
- [ ] 1.2.3 Verify all columns were added successfully
- [ ] 1.2.4 Verify index was created
- [ ] 1.2.5 Verify existing data was migrated correctly

**Validation:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'collage_recuerdos';
```

### Task 1.3: Enable Supabase Realtime (Optional)
- [ ] 1.3.1 Go to Supabase Dashboard → Database → Replication
- [ ] 1.3.2 Enable Realtime for `collage_recuerdos` table
- [ ] 1.3.3 Verify Realtime is enabled
- [ ] 1.3.4 Test Realtime connection from frontend

**Note:** This is optional. System works without it.

---

## Phase 2: TypeScript Types & Interfaces

### Task 2.1: Update TypeScript Interfaces
- [ ] 2.1.1 Update `CollageRecuerdo` interface in `components/CaptureMemoryButton.tsx`
- [ ] 2.1.2 Add new fields: `fecha_captura`, `hora_captura`, `timezone`, `ubicacion`, `tamano_optimizado`, `formato_final`
- [ ] 2.1.3 Update `DisplayItem` interface in `app/collage/page.tsx`
- [ ] 2.1.4 Ensure all fields are properly typed
- [ ] 2.1.5 Run TypeScript compiler to check for errors

**Files to modify:**
- `components/CaptureMemoryButton.tsx`
- `app/collage/page.tsx`

### Task 2.2: Update UploadMetadata Interface
- [ ] 2.2.1 Review `UploadMetadata` interface in `lib/upload-utils.ts`
- [ ] 2.2.2 Ensure it includes all necessary fields
- [ ] 2.2.3 Add JSDoc comments for clarity
- [ ] 2.2.4 Export interface for use in other files

---

## Phase 3: Image Processing Improvements

### Task 3.1: Improve EXIF Extraction
- [ ] 3.1.1 Modify `processImageForUpload()` to extract EXIF from camera photos too
- [ ] 3.1.2 Remove `if (!isCamera)` condition from EXIF extraction
- [ ] 3.1.3 Prioritize EXIF date over current date
- [ ] 3.1.4 Prioritize EXIF location over browser location
- [ ] 3.1.5 Add error handling for corrupted EXIF data
- [ ] 3.1.6 Add console logs for debugging

**File:** `lib/upload-utils.ts`

**Change:**
```typescript
// BEFORE:
if (!isCamera && workingFile.type.startsWith('image/')) {
  // Extract EXIF
}

// AFTER:
if (workingFile.type.startsWith('image/')) {
  // Extract EXIF always
}
```

### Task 3.2: Test EXIF Extraction
- [ ] 3.2.1 Test with JPEG from camera
- [ ] 3.2.2 Test with JPEG from galería
- [ ] 3.2.3 Test with PNG (no EXIF expected)
- [ ] 3.2.4 Test with HEIC from iPhone
- [ ] 3.2.5 Test with image without EXIF
- [ ] 3.2.6 Verify metadata is extracted correctly
- [ ] 3.2.7 Verify no errors when EXIF is missing

---

## Phase 4: API Endpoint Improvements

### Task 4.1: Update Upload API to Save Metadata
- [ ] 4.1.1 Modify `/api/collage/upload/route.ts`
- [ ] 4.1.2 Extract `capturedAt` from metadata
- [ ] 4.1.3 Format `hora_captura` in America/Bogota timezone
- [ ] 4.1.4 Save `ubicacion` as JSONB
- [ ] 4.1.5 Save `tamano_optimizado` (file size)
- [ ] 4.1.6 Save `formato_final` (image/webp)
- [ ] 4.1.7 Ensure all fields are included in INSERT
- [ ] 4.1.8 Return complete object with `.select().single()`

**File:** `app/api/collage/upload/route.ts`

### Task 4.2: Test Upload API
- [ ] 4.2.1 Test upload with EXIF metadata
- [ ] 4.2.2 Test upload without EXIF metadata
- [ ] 4.2.3 Verify all fields are saved to database
- [ ] 4.2.4 Verify response includes all fields
- [ ] 4.2.5 Test error handling
- [ ] 4.2.6 Verify file is uploaded to storage correctly

---

## Phase 5: Frontend Sync Improvements

### Task 5.1: Implement Optimistic Update (ALREADY DONE ✅)
- [x] 5.1.1 Update `handleRecuerdoSubido` callback
- [x] 5.1.2 Add duplicate prevention logic
- [x] 5.1.3 Reset filters when new item is added
- [x] 5.1.4 Add scroll to top
- [x] 5.1.5 Add refetch after 2 seconds
- [x] 5.1.6 Add console logs for debugging

**File:** `app/collage/page.tsx`  
**Status:** ✅ Already implemented in previous fix

### Task 5.2: Implement Realtime Subscription (ALREADY DONE ✅)
- [x] 5.2.1 Subscribe to INSERT events
- [x] 5.2.2 Subscribe to DELETE events
- [x] 5.2.3 Add duplicate prevention in Realtime handler
- [x] 5.2.4 Add console logs for connection status
- [x] 5.2.5 Clean up subscription on unmount

**File:** `app/collage/page.tsx`  
**Status:** ✅ Already implemented in previous fix

### Task 5.3: Test Sync Functionality
- [ ] 5.3.1 Test upload from camera
- [ ] 5.3.2 Test upload from gallery
- [ ] 5.3.3 Verify image appears in < 1 second
- [ ] 5.3.4 Verify image appears in first position
- [ ] 5.3.5 Verify no duplicates
- [ ] 5.3.6 Verify filters reset correctly
- [ ] 5.3.7 Verify scroll to top works
- [ ] 5.3.8 Test on mobile and desktop

---

## Phase 6: Date Display Logic

### Task 6.1: Create Date Helper Functions
- [ ] 6.1.1 Create `lib/date-utils.ts` file
- [ ] 6.1.2 Implement `getDisplayDate(item)` function
- [ ] 6.1.3 Implement `formatDisplayDate(date)` function
- [ ] 6.1.4 Implement `formatFullDate(date, hora)` function
- [ ] 6.1.5 Add JSDoc comments
- [ ] 6.1.6 Export functions

**File:** `lib/date-utils.ts` (new file)

**Functions:**
```typescript
export function getDisplayDate(item: DisplayItem): Date
export function formatDisplayDate(date: Date): string
export function formatFullDate(date: Date, hora?: string): string
```

### Task 6.2: Update UI to Use New Date Logic
- [ ] 6.2.1 Import date helper functions in `app/collage/page.tsx`
- [ ] 6.2.2 Update grid card date display
- [ ] 6.2.3 Update lightbox date display
- [ ] 6.2.4 Update hover tooltip date display
- [ ] 6.2.5 Ensure timezone is America/Bogota
- [ ] 6.2.6 Test date display with various items

**File:** `app/collage/page.tsx`

### Task 6.3: Test Date Display
- [ ] 6.3.1 Test with item that has `fecha_captura`
- [ ] 6.3.2 Test with item that only has `fecha_subida`
- [ ] 6.3.3 Test with item that has `hora_captura`
- [ ] 6.3.4 Verify no "31 diciembre" generic dates
- [ ] 6.3.5 Verify dates are in Spanish
- [ ] 6.3.6 Verify timezone is correct

---

## Phase 7: Data Migration Script

### Task 7.1: Create Migration Script
- [ ] 7.1.1 Create `scripts/fix-collage-dates.ts` file
- [ ] 7.1.2 Implement logic to fetch all records
- [ ] 7.1.3 Implement logic to extract EXIF from stored images
- [ ] 7.1.4 Implement logic to update records with correct dates
- [ ] 7.1.5 Add progress logging
- [ ] 7.1.6 Add error handling
- [ ] 7.1.7 Generate final report

**File:** `scripts/fix-collage-dates.ts` (new file)

### Task 7.2: Test Migration Script
- [ ] 7.2.1 Test on development environment first
- [ ] 7.2.2 Verify it doesn't break existing data
- [ ] 7.2.3 Verify it extracts EXIF correctly
- [ ] 7.2.4 Verify it updates records correctly
- [ ] 7.2.5 Review generated report

### Task 7.3: Execute Migration Script
- [ ] 7.3.1 Backup database before running
- [ ] 7.3.2 Run script on production
- [ ] 7.3.3 Monitor progress
- [ ] 7.3.4 Review final report
- [ ] 7.3.5 Verify data in Supabase Dashboard
- [ ] 7.3.6 Test collage page to see corrected dates

---

## Phase 8: Testing & Validation

### Task 8.1: Unit Tests
- [ ] 8.1.1 Write tests for `processImageForUpload()`
- [ ] 8.1.2 Write tests for date helper functions
- [ ] 8.1.3 Write tests for EXIF extraction
- [ ] 8.1.4 Write tests for WebP conversion
- [ ] 8.1.5 Run all tests and ensure they pass

**Files:**
- `lib/__tests__/upload-utils.test.ts`
- `lib/__tests__/date-utils.test.ts`

### Task 8.2: Integration Tests
- [ ] 8.2.1 Write test for complete upload flow
- [ ] 8.2.2 Write test for sync functionality
- [ ] 8.2.3 Write test for date display
- [ ] 8.2.4 Run all tests and ensure they pass

**File:** `app/collage/__tests__/sync.test.tsx`

### Task 8.3: Manual Testing Checklist
- [ ] 8.3.1 Upload from camera on mobile
- [ ] 8.3.2 Upload from gallery on mobile
- [ ] 8.3.3 Upload from camera on desktop
- [ ] 8.3.4 Upload from gallery on desktop
- [ ] 8.3.5 Verify image appears immediately
- [ ] 8.3.6 Verify date is correct
- [ ] 8.3.7 Verify location is correct (if available)
- [ ] 8.3.8 Verify no duplicates
- [ ] 8.3.9 Verify filters work correctly
- [ ] 8.3.10 Verify sorting works correctly
- [ ] 8.3.11 Test deletion (admin only)
- [ ] 8.3.12 Test Realtime sync (if enabled)

### Task 8.4: Performance Testing
- [ ] 8.4.1 Measure time from upload to render
- [ ] 8.4.2 Measure image conversion time
- [ ] 8.4.3 Measure page load time
- [ ] 8.4.4 Verify all metrics meet requirements
- [ ] 8.4.5 Optimize if necessary

**Target Metrics:**
- Upload to render: < 1 second
- Image conversion: < 3 seconds
- Page load: < 2 seconds
- Average WebP size: < 200KB

---

## Phase 9: Documentation

### Task 9.1: Update Technical Documentation
- [ ] 9.1.1 Document new database schema
- [ ] 9.1.2 Document API changes
- [ ] 9.1.3 Document date logic
- [ ] 9.1.4 Document migration process
- [ ] 9.1.5 Update README if necessary

### Task 9.2: Create User Documentation
- [ ] 9.2.1 Document how to upload photos
- [ ] 9.2.2 Document how to use filters
- [ ] 9.2.3 Document date display logic
- [ ] 9.2.4 Create troubleshooting guide

### Task 9.3: Create Deployment Guide
- [ ] 9.3.1 Document deployment steps
- [ ] 9.3.2 Document rollback procedure
- [ ] 9.3.3 Document verification steps
- [ ] 9.3.4 Document monitoring

---

## Phase 10: Deployment

### Task 10.1: Pre-Deployment Checklist
- [ ] 10.1.1 All tests passing
- [ ] 10.1.2 Code reviewed and approved
- [ ] 10.1.3 Database migration tested
- [ ] 10.1.4 Backup created
- [ ] 10.1.5 Deployment plan reviewed

### Task 10.2: Deploy to Production
- [ ] 10.2.1 Execute database migration
- [ ] 10.2.2 Deploy frontend changes
- [ ] 10.2.3 Deploy API changes
- [ ] 10.2.4 Verify deployment successful
- [ ] 10.2.5 Monitor for errors

### Task 10.3: Post-Deployment Validation
- [ ] 10.3.1 Test upload functionality
- [ ] 10.3.2 Test sync functionality
- [ ] 10.3.3 Test date display
- [ ] 10.3.4 Test filters
- [ ] 10.3.5 Monitor error logs
- [ ] 10.3.6 Monitor performance metrics

### Task 10.4: Execute Data Migration
- [ ] 10.4.1 Run `fix-collage-dates.ts` script
- [ ] 10.4.2 Monitor progress
- [ ] 10.4.3 Review report
- [ ] 10.4.4 Verify corrected dates in UI
- [ ] 10.4.5 Document results

---

## Phase 11: Monitoring & Optimization

### Task 11.1: Monitor Production
- [ ] 11.1.1 Monitor error rates
- [ ] 11.1.2 Monitor performance metrics
- [ ] 11.1.3 Monitor user feedback
- [ ] 11.1.4 Monitor database performance
- [ ] 11.1.5 Monitor storage usage

### Task 11.2: Optimize if Necessary
- [ ] 11.2.1 Optimize slow queries
- [ ] 11.2.2 Optimize image conversion
- [ ] 11.2.3 Optimize Realtime connection
- [ ] 11.2.4 Optimize bundle size
- [ ] 11.2.5 Document optimizations

---

## 📊 Progress Tracking

### Summary
- **Total Tasks:** 11 phases
- **Completed:** 2 phases (Phase 5.1, 5.2)
- **In Progress:** 0 phases
- **Remaining:** 9 phases

### Priority
1. **HIGH:** Phase 1, 2, 3, 4, 6 (Core functionality)
2. **MEDIUM:** Phase 7, 8 (Data migration & testing)
3. **LOW:** Phase 9, 10, 11 (Documentation & deployment)

### Estimated Time
- Phase 1: 1 hour
- Phase 2: 30 minutes
- Phase 3: 1 hour
- Phase 4: 1 hour
- Phase 5: ✅ Done
- Phase 6: 1 hour
- Phase 7: 2 hours
- Phase 8: 3 hours
- Phase 9: 2 hours
- Phase 10: 1 hour
- Phase 11: Ongoing

**Total:** ~12-14 hours

---

## 🎯 Success Criteria

- [ ] Image appears in < 1 second after upload
- [ ] Dates are extracted from EXIF metadata
- [ ] Dates are displayed correctly in Spanish
- [ ] No "31 diciembre" generic dates
- [ ] All images converted to WebP
- [ ] No duplicates in collage
- [ ] Filters work correctly
- [ ] Realtime sync works (if enabled)
- [ ] All tests passing
- [ ] Performance metrics met
- [ ] No errors in production

---

**Created:** 2025-02-23  
**Status:** Ready for Implementation  
**Version:** 1.0
