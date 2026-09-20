# Zoho Catalyst (AppSail) Deployment & Configuration Guide

This guide provides a step-by-step walkthrough for deploying the **King's Platter Digital Menu** Next.js application to **Zoho Catalyst AppSail**, along with a detailed solution for the **1,000-character environment variable limit error** (`FIREBASE_PRIVATE_KEY`).

---

## 1. Architecture & Catalyst Configuration Breakdown

Zoho Catalyst **AppSail** hosts standalone full-stack web applications (Node.js/Next.js). The repository is already pre-configured with the necessary Catalyst configuration files:

| File | Purpose | Configuration Details |
| :--- | :--- | :--- |
| **[`catalyst.json`](file:///d:/TM_project/kings-platter-digital-menu/catalyst.json)** | Core Catalyst Project Manifest | Configures AppSail stack (`node22`), build command (`npm install && npm run build`), and start command (`npm start`). |
| **[`app-service.json`](file:///d:/TM_project/kings-platter-digital-menu/app-service.json)** | AppSail Service Definition | Specifies Node.js version and execution command. |
| **[`start-server.js`](file:///d:/TM_project/kings-platter-digital-menu/start-server.js)** | Production Server Launcher | Dynamically binds Next.js to `0.0.0.0` and reads `X_ZOHO_CATALYST_LISTEN_PORT` (required by Catalyst AppSail). |
| **[`.catalystignore`](file:///d:/TM_project/kings-platter-digital-menu/.catalystignore)** | Deployment File Excluder | Excludes heavy folders (`node_modules`, `.next`, `.git`, `.env.local`) to speed up deployment uploads. |

---

## 2. Resolving the `FIREBASE_PRIVATE_KEY` 1000-Character Error

### Problem Statement
When adding `FIREBASE_PRIVATE_KEY` in the Zoho Catalyst Console (under **AppSail > Environment Variables**), Catalyst throws the following error:
> `value must contains only 1000 characters`

### Root Cause
Zoho Catalyst enforces a hard limit of **1,000 characters per environment variable value**. Firebase RSA private keys (`-----BEGIN PRIVATE KEY-----\n...`) typically range from **1,700 to 1,950 characters**, which exceeds Catalyst's limit.

### Solution: Split Key Configuration
The application code in [`src/lib/firebase/server.ts`](file:///d:/TM_project/kings-platter-digital-menu/src/lib/firebase/server.ts) has been upgraded to automatically detect and concatenate split private key variables: `FIREBASE_PRIVATE_KEY_PART1` and `FIREBASE_PRIVATE_KEY_PART2`.

---

## 3. Step-by-Step Guide: How to Split Your Firebase Private Key

### Step 1: Obtain your Raw Private Key
From your Firebase Service Account JSON (or `.env.local`), copy the full `private_key` string, which looks like:
```text
"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC..."
```

### Step 2: Split into Two Strings (<1,000 Chars Each)
Divide the private key string at approximately character position **900** (or at a convenient `\n` boundary):

1. **`FIREBASE_PRIVATE_KEY_PART1`**:
   Copy the first ~900 characters:
   ```text
   -----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC... (first ~900 chars)
   ```
2. **`FIREBASE_PRIVATE_KEY_PART2`**:
   Copy the remaining characters:
   ```text
   ... (remaining chars) ... \n-----END PRIVATE KEY-----\n
   ```

> [!TIP]
> Keep literal `\n` strings intact. The server SDK automatically converts `\n` to valid private key line breaks upon application startup.

---

## 4. Zoho Catalyst Environment Variables Setup Checklist

In the **Zoho Catalyst Console** -> **AppSail** -> **Environment Variables**, configure the following variables:

### Client-Side Variables (Browser Accessible)
| Variable Name | Description | Example / Source |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Application Domain URL | `https://your-appsail-app.catalystserver.com` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | `kings-platter-menu` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `kings-platter-menu.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging Sender ID | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | From Firebase Console |

### Server-Side Variables (Private & Secure)
| Variable Name | Description | Value Note |
| :--- | :--- | :--- |
| `FIREBASE_PROJECT_ID` | Admin Project ID | `kings-platter-menu` |
| `FIREBASE_CLIENT_EMAIL` | Service Account Email | `firebase-adminsdk-xxxxx@...iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY_PART1` | **Part 1** of RSA Key | First ~900 characters (<1,000 limit) |
| `FIREBASE_PRIVATE_KEY_PART2` | **Part 2** of RSA Key | Remaining characters (<1,000 limit) |

---

## 5. Step-by-Step Deployment Instructions

### Prerequisites
1. Install Zoho Catalyst CLI globally (if not already installed):
   ```bash
   npm install -g zcatalyst-cli
   ```
2. Log into your Zoho Catalyst account via terminal:
   ```bash
   catalyst login
   ```

### Step-by-Step Commands

1. **Initialize Catalyst Workspace in Project Folder**:
   ```bash
   catalyst init
   ```
   - Select your **Catalyst Project**.
   - Select **AppSail** as the target service.
   - Choose **Node.js 22** environment.

2. **Validate Build Locally**:
   Before deploying, verify that the project builds cleanly:
   ```bash
   npm run build
   ```

3. **Deploy to Catalyst AppSail**:
   Run the deploy command from the project root:
   ```bash
   catalyst deploy
   ```
   Catalyst will package the source code (respecting `.catalystignore`), trigger the build script (`npm install && npm run build`), and launch `npm start` (executing `start-server.js`).

4. **Verify Deployment**:
   - Access the AppSail URL provided in the Catalyst terminal output.
   - Check **AppSail Logs** in Catalyst Console to confirm `[King's Platter] Starting Next.js server on 0.0.0.0:PORT...` and Firebase Admin SDK initialization success.

---

## 6. Verification & Troubleshooting

- **Symptom: 502 Bad Gateway / Application Timeout**:
  Ensure `start-server.js` is set as the start command in `catalyst.json` / `app-service.json`. Standard Next.js server needs to bind to `0.0.0.0` and listen to `process.env.X_ZOHO_CATALYST_LISTEN_PORT`.
- **Symptom: Firebase Admin Initialization Failed**:
  Check Catalyst Console Environment Variables. Verify `FIREBASE_PRIVATE_KEY_PART1` and `FIREBASE_PRIVATE_KEY_PART2` are both populated and together reconstitute the exact RSA Private Key.
