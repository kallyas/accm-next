# Google Drive Image Download Setup

This guide will help you set up Google Drive API access to download images from your Google Drive folder to the Pearl Hub gallery.

## Prerequisites

- A Google account with access to the Google Drive folder
- Node.js and yarn installed
- Google Cloud Console access

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Pearl Hub Gallery" (or any name you prefer)
4. Click "Create"

## Step 2: Enable Google Drive API

1. In your new project, go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click on it and press **Enable**

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: "Pearl Hub Gallery"
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**
   - Skip the Scopes section
   - Add yourself as a test user
   - Click **Save and Continue**
4. Back to creating OAuth client ID:
   - Application type: **Desktop app**
   - Name: "Pearl Hub Desktop Client"
   - Click **Create**
5. Click **Download JSON** on the popup
6. Rename the downloaded file to `google-credentials.json`
7. Move it to your project root directory (same level as package.json)

## Step 4: Authenticate

Run the authentication script:

```bash
yarn gdrive:auth
```

This will:
1. Display a URL - open it in your browser
2. Sign in with your Google account
3. Grant permissions to the app
4. Copy the authorization code from the browser
5. Paste it back in the terminal
6. Save the authentication token as `google-token.json`

## Step 5: Download Images

Once authenticated, run the download script:

```bash
yarn gdrive:download
```

This will:
1. Connect to Google Drive using your credentials
2. List all images in the folder: `1NHQGBSs4V2bix5WJ3Vn58GlKXdH6ltQd`
3. Download them to `/public/accm/juba-2026/`
4. Generate a data snippet for `data.ts`

## Step 6: Update data.ts

After the download completes:

1. Open `scripts/image-data-snippet.ts`
2. Copy the generated code
3. Add it to `data.ts`:
   - Add the `jubaEventImages` array
   - Update the `allImages` export to include it

Example:
```typescript
// In data.ts, add at the bottom:
import { jubaEventImages } from './scripts/image-data-snippet';

export const allImages: ImageData[] = [
  ...eventImages,
  ...successImages,
  ...otherImages,
  ...jubaEventImages  // Add this line
];
```

## Security Notes

⚠️ **Important:** The following files contain sensitive information and should NOT be committed to git:

- `google-credentials.json` - Your OAuth credentials
- `google-token.json` - Your access token

Add them to `.gitignore`:

```bash
echo "google-credentials.json" >> .gitignore
echo "google-token.json" >> .gitignore
```

## Troubleshooting

### "Error: google-credentials.json not found"
- Make sure you downloaded the credentials file from Google Cloud Console
- Rename it to exactly `google-credentials.json`
- Place it in the project root (same folder as package.json)

### "Error: google-token.json not found"
- Run the authentication script first: `npx ts-node scripts/authenticate-gdrive.ts`

### "Invalid authentication credentials"
- Your token may have expired
- Delete `google-token.json` and re-run the authentication script

### "No image files found in the folder"
- Verify the folder ID is correct: `1NHQGBSs4V2bix5WJ3Vn58GlKXdH6ltQd`
- Make sure your Google account has access to this folder
- Check that the folder contains image files (JPG, PNG, etc.)

## Need Help?

If you encounter any issues, check:
- [Google Drive API Documentation](https://developers.google.com/drive/api/guides/about-sdk)
- [OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
