import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';

const FOLDER_ID = '1NHQGBSs4V2bix5WJ3Vn58GlKXdH6ltQd';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'accm', 'juba-2026');

interface ImageMetadata {
  filename: string;
  width: number;
  height: number;
  size: number;
}

async function downloadGoogleDriveImages() {
  console.log('🚀 Starting Google Drive image download...\n');

  // Check for credentials
  const credentialsPath = path.join(process.cwd(), 'google-credentials.json');
  if (!fs.existsSync(credentialsPath)) {
    console.error('❌ Error: google-credentials.json not found!');
    console.log('\n📝 Please follow the setup instructions in GOOGLE_DRIVE_SETUP.md');
    process.exit(1);
  }

  try {
    // Load credentials
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    // Create OAuth2 client
    const auth = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uris[0]
    );

    // Check for token
    const tokenPath = path.join(process.cwd(), 'google-token.json');
    if (!fs.existsSync(tokenPath)) {
      console.error('❌ Error: google-token.json not found!');
      console.log('\n📝 Please run the authentication script first.');
      console.log('   Run: yarn gdrive:auth');
      process.exit(1);
    }

    const token = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    auth.setCredentials(token);

    const drive = google.drive({ version: 'v3', auth });

    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`✅ Created directory: ${OUTPUT_DIR}\n`);
    }

    // List files in the Google Drive folder
    console.log('📂 Fetching files from Google Drive folder...');
    const response = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and mimeType contains 'image/'`,
      fields: 'files(id, name, mimeType, size)',
      pageSize: 1000,
    });

    const files = response.data.files;
    if (!files || files.length === 0) {
      console.log('⚠️  No image files found in the folder.');
      return;
    }

    console.log(`📸 Found ${files.length} images\n`);

    const metadata: ImageMetadata[] = [];

    // Download each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.id || !file.name) continue;

      console.log(`[${i + 1}/${files.length}] Downloading: ${file.name}`);

      try {
        const dest = path.join(OUTPUT_DIR, file.name);
        const destStream = fs.createWriteStream(dest);

        const res = await drive.files.get(
          { fileId: file.id, alt: 'media' },
          { responseType: 'stream' }
        );

        await new Promise((resolve, reject) => {
          (res.data as Readable)
            .on('end', () => {
              console.log(`   ✓ Saved to: ${dest}`);

              // Add to metadata
              metadata.push({
                filename: file.name,
                width: 1920, // Default, will need manual adjustment
                height: 1080, // Default, will need manual adjustment
                size: parseInt(file.size || '0'),
              });

              resolve(null);
            })
            .on('error', reject)
            .pipe(destStream);
        });
      } catch (error) {
        console.error(`   ✗ Failed to download ${file.name}:`, error);
      }
    }

    // Generate data.ts snippet
    console.log('\n✅ Download complete!\n');
    console.log('📋 Generating data.ts snippet...\n');

    const dataSnippet = generateDataTsSnippet(metadata);
    const snippetPath = path.join(process.cwd(), 'scripts', 'image-data-snippet.ts');
    fs.writeFileSync(snippetPath, dataSnippet);

    console.log('✅ Data snippet saved to: scripts/image-data-snippet.ts');
    console.log('\n📝 Next steps:');
    console.log('   1. Review the generated snippet in scripts/image-data-snippet.ts');
    console.log('   2. Add the images array to data.ts');
    console.log('   3. Update the allImages export to include the new images\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

function generateDataTsSnippet(metadata: ImageMetadata[]): string {
  const baseDate = new Date('2026-01-16');

  return `// Juba, South Sudan - January 16, 2026 Event Images
// Generated on ${new Date().toISOString()}

const jubaEventFiles = ${JSON.stringify(metadata.map(m => m.filename), null, 2)};

export const jubaEventImages: ImageData[] = jubaEventFiles.map((filename, index) => {
  const dimensions = getRandomDimensions();
  const date = new Date(${baseDate.getTime()}); // January 16, 2026
  const isFeatured = index % 5 === 0; // Every 5th image is featured

  return {
    id: 300 + index, // Starting at 300 to avoid conflicts
    src: \`/accm/juba-2026/\${filename}\`,
    alt: \`Juba, South Sudan Event - January 16, 2026 (\${index + 1})\`,
    category: "events",
    description: "ACCM event in Juba, South Sudan - January 16, 2026",
    date: date.toISOString(),
    width: dimensions.width,
    height: dimensions.height,
    tags: ["juba", "south-sudan", "2026", "community", "education"],
    featured: isFeatured,
  };
});

// Add to allImages export:
// export const allImages: ImageData[] = [...eventImages, ...successImages, ...otherImages, ...jubaEventImages];
`;
}

// Run the script
downloadGoogleDriveImages();
