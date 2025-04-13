# File Management System Documentation

## Table of Contents
1. [Authentication Flow in Detail](#authentication-flow-in-detail)
2. [File Upload Process](#file-upload-process)
3. [Architecture Overview](#architecture-overview)
4. [Database Integration](#database-integration)
5. [Key Components](#key-components)

## Authentication Flow in Detail

### 1. Initial Authentication Request
**File: `/app/(auth)/sign-in/page.tsx`**
```typescript
import AuthForm from "@/components/AuthForm";
const SignIn = () => <AuthForm type="sign-in" />;
```

### 2. Authentication Form Processing
**File: `/components/AuthForm.tsx`**
```typescript
const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const [accountId, setAccountId] = useState(null);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const user = type === "sign-up"
        ? await createAccount({
            fullName: values.fullName || "",
            email: values.email,
          })
        : await signInUser({ email: values.email });

      setAccountId(user.accountId);
    } catch {
      setErrorMessage("Failed to create account. Please try again.");
    }
  };
  
  return (
    <>
      <Form {...form}>
        {/* Form fields */}
      </Form>
      {accountId && (
        <OtpModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};
```

### 3. Server-Side Authentication Actions
**File: `/lib/actions/user.actions.ts`**
```typescript
export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      await sendEmailOTP({ email });
      return parseStringify({ accountId: existingUser.accountId });
    }
    return parseStringify({ accountId: null, error: "User not found" });
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createSession(accountId, password);
    
    // Set HTTP-only cookie for security
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};
```

### 4. Database Integration for Authentication
**File: `/lib/appwrite/config.ts`**
```typescript
export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
};
```

### Authentication Flow Sequence
1. User enters email (and full name for sign-up)
2. Form validation using Zod schema
3. Server action (`signInUser` or `createAccount`) is called
4. OTP is sent to user's email
5. OTP Modal appears for verification
6. After OTP verification:
   - Session is created
   - HTTP-only cookie is set
   - User is redirected to dashboard

## File Upload Process

### 1. File Upload Component
**File: `/components/FileUploader.tsx`**
```typescript
const FileUploader = () => {
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    await uploadFile({
      file,
      ownerId: currentUser.$id,
      accountId: currentUser.accountId,
      path: pathname,
    });
  };
};
```

### 2. Server-Side File Processing
**File: `/lib/actions/file.actions.ts`**
```typescript
export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();

  try {
    // 1. Upload file to Appwrite Storage
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile,
    );

    // 2. Create file document in database
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const newFile = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      ID.unique(),
      fileDocument,
    );

    // 3. Update UI
    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};
```

### 3. File Management Functions
**File: `/lib/actions/file.actions.ts`**
```typescript
// Get files with filtering
export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetFilesProps) => {
  const { databases } = await createAdminClient();
  const currentUser = await getCurrentUser();
  const queries = createQueries(currentUser, types, searchText, sort, limit);
  return await databases.listDocuments(/*...*/);
};

// Rename file
export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { databases } = await createAdminClient();
  const newName = `${name}.${extension}`;
  return await databases.updateDocument(/*...*/);
};

// Delete file
export const deleteFile = async ({
  fileId,
  bucketFileId,
  path,
}: DeleteFileProps) => {
  const { databases, storage } = await createAdminClient();
  await databases.deleteDocument(/*...*/);
  await storage.deleteFile(/*...*/);
};
```

### File Upload Flow Sequence
1. User selects or drops a file
2. File is validated (size, type)
3. File is uploaded to Appwrite Storage
4. File metadata is stored in database
5. UI is updated with new file
6. Storage usage is recalculated

### Storage Management
**File: `/lib/actions/file.actions.ts`**
```typescript
export async function getTotalSpaceUsed() {
  const { databases } = await createSessionClient();
  const currentUser = await getCurrentUser();
  
  const totalSpace = {
    image: { size: 0, latestDate: "" },
    document: { size: 0, latestDate: "" },
    video: { size: 0, latestDate: "" },
    audio: { size: 0, latestDate: "" },
    other: { size: 0, latestDate: "" },
    used: 0,
    all: 2 * 1024 * 1024 * 1024 /* 2GB available */,
  };
  
  // Calculate usage statistics
  files.documents.forEach(file => {
    const fileType = file.type as FileType;
    totalSpace[fileType].size += file.size;
    totalSpace.used += file.size;
    // Update latest date
    if (new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)) {
      totalSpace[fileType].latestDate = file.$updatedAt;
    }
  });
  
  return parseStringify(totalSpace);
}

## Architecture Overview

The application is built using:
- Next.js 13+ (App Router)
- Appwrite (Backend as a Service)
- TypeScript
- Tailwind CSS

### Project Structure
```
ps/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   │   ├── sign-in/       # Sign-in page
│   │   └── sign-up/       # Sign-up page
│   └── (root)/            # Protected routes
│       ├── [type]/        # Dynamic file type routes
│       ├── layout.tsx     # Root layout with sidebar
│       └── page.tsx       # Dashboard page
├── components/            # React components
├── lib/                   # Core functionality
│   ├── actions/          # Server actions
│   └── appwrite/         # Appwrite configuration
└── public/               # Static assets
```

## Database Integration

### Appwrite Configuration
```typescript
// Configuration for Appwrite services
export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
  filesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
};
```

### Collections Structure
1. **Users Collection**
   - `fullName`: string
   - `email`: string
   - `avatar`: string
   - `accountId`: string

2. **Files Collection**
   - Stores file metadata
   - Links to actual files in Storage

### Storage System
- Uses Appwrite Storage for file management
- Supports multiple file types
- Automatic file type detection
- File size limits and quotas

## Key Components

### Dashboard
- Storage overview with usage statistics
- File type summary with filtering
- Recent files list
- Real-time updates

### File Management
- File upload support
- File type categorization
- File preview
- File actions (download, delete, share)

### UI Components
1. **Sidebar**
   - Navigation menu
   - User profile
   - Quick actions

2. **Header**
   - Search functionality
   - User actions
   - Notifications

3. **Mobile Navigation**
   - Responsive bottom navigation
   - Quick access to key features

## Features

### File Management
- Upload files
- View file details
- Download files
- Delete files
- Share files
- File type filtering
- Search functionality

### Storage Management
- Storage usage tracking
- File type categorization
- Storage limits
- Usage statistics

### User Experience
- Responsive design
- Mobile-first approach
- Dark theme
- Loading states
- Error handling
- Toast notifications

### Security
- Secure file storage
- Protected routes
- Secure authentication
- Session management
- Rate limiting

## Environment Variables
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=your_endpoint
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE=your_database_id
NEXT_PUBLIC_APPWRITE_USERS_COLLECTION=your_users_collection_id
NEXT_PUBLIC_APPWRITE_FILES_COLLECTION=your_files_collection_id
NEXT_PUBLIC_APPWRITE_BUCKET=your_bucket_id
NEXT_APPWRITE_KEY=your_api_key
