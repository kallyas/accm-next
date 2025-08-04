# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `yarn dev` or `npm run dev`
- **Build for production**: `yarn build` or `npm run build`
- **Start production server**: `yarn start` or `npm run start`
- **Lint code**: `yarn lint` or `npm run lint`
- **Run database migrations**: `yarn migrate` or `npm run migrate`
- **Seed database**: `npx prisma db seed`
- **Generate Prisma client**: `npx prisma generate`
- **View database**: `npx prisma studio`

## Architecture Overview

**Pearl Hub** is a Next.js 14 full-stack application for the African Centre For Career Mentorship (ACCM). It's a comprehensive platform for career development, mentorship, and educational resources.

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: Zustand + React Query (@tanstack/react-query)
- **File Storage**: AWS S3/Cloudflare R2
- **Email**: Resend for transactional emails

### Key Architecture Patterns

**Role-Based Access Control**: The application has two main user roles:
- `ADMIN`: Access to `/admin/*` routes for platform management
- `USER`: Access to `/dashboard/*` routes with progress-based restrictions

**Progress-Based Flow**: Users progress through stages:
1. `PAYMENT_PENDING` → Complete payment
2. `PERSONAL_DISCOVERY_PENDING` → Complete personal discovery questionnaire  
3. `CV_ALIGNMENT_PENDING` → Complete CV alignment
4. `SCHOLARSHIP_MATRIX_PENDING` → Complete scholarship matrix

**Middleware Protection**: `/middleware.ts` handles authentication, role-based access, and progress validation across protected routes.

### Directory Structure

- **`/app`**: Next.js App Router pages and API routes
  - `/admin/*`: Admin dashboard and management interfaces
  - `/dashboard/*`: User dashboard and services
  - `/api/*`: API endpoints organized by feature
- **`/components`**: Reusable React components
  - `/ui/*`: Radix UI-based design system components
  - `/admin/*`: Admin-specific components
  - `/dashboard/*`: Dashboard-specific components
- **`/lib`**: Shared utilities and configurations
  - `auth.ts`: NextAuth configuration
  - `db.ts`: Prisma client setup
  - `email.ts`: Email service configuration
- **`/prisma`**: Database schema and migrations
- **`/hooks`**: Custom React hooks for data fetching
- **`/types`**: TypeScript type definitions

### Database Schema Key Models

- **User**: Core user model with role-based permissions and progress tracking
- **PersonalDiscovery**: SWOT analysis and career aspirations
- **CV**: User-uploaded CVs with analysis capabilities  
- **Course/Enrollment**: Educational content and user progress
- **Event/UserEvent**: Events and registrations
- **Subscription**: Payment and plan management
- **MarketingCampaign**: Email marketing system

### Authentication & Authorization

Authentication uses NextAuth.js with:
- Credentials provider (email/password with bcrypt)
- JWT strategy with 30-day sessions
- Prisma adapter for user storage
- Custom middleware for route protection

### File Upload & Storage

- Uses AWS S3 SDK or Cloudflare R2 for file storage
- Pre-signed URLs for secure uploads
- Document parsing for PDF/Word files using mammoth and pdf-parse

### Email System

- Resend integration for transactional emails
- Template-based emails in `/lib/email-templates/`
- Rate limiting and batch processing for marketing campaigns

## Important Development Notes

**Environment Variables Required**:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: NextAuth JWT secret
- `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`: File storage
- `RESEND_API_KEY`: Email service

**Testing**: No test framework currently configured - check with user before assuming test commands.

**Database Migrations**: Always run `yarn migrate` after pulling schema changes.

**Type Safety**: The project uses strict TypeScript - run `npx tsc --noEmit` to check types.