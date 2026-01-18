import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'google-token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'google-credentials.json');

async function authenticate() {
  console.log('🔐 Google Drive Authentication\n');

  // Check for credentials
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('❌ Error: google-credentials.json not found!');
    console.log('\n📝 Please follow these steps:');
    console.log('   1. Go to https://console.cloud.google.com/');
    console.log('   2. Create a new project (or select existing)');
    console.log('   3. Enable Google Drive API');
    console.log('   4. Create OAuth 2.0 credentials (Desktop app)');
    console.log('   5. Download credentials as google-credentials.json');
    console.log('   6. Place it in the project root directory\n');
    process.exit(1);
  }

  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Generate auth URL
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });

    console.log('🌐 Please visit this URL to authorize the application:\n');
    console.log(authUrl);
    console.log('\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('📋 Enter the authorization code from the page: ', async (code) => {
      rl.close();

      try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Save token
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
        console.log('\n✅ Authentication successful!');
        console.log(`✅ Token saved to: ${TOKEN_PATH}\n`);
        console.log('🚀 You can now run the download script:');
        console.log('   yarn gdrive:download\n');
      } catch (error) {
        console.error('❌ Error retrieving access token:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ Error loading credentials:', error);
    process.exit(1);
  }
}

authenticate();
