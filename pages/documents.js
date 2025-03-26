// pages/documents.js
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../components/common/Layout';
import Placeholder from '../components/common/Placeholder';

export default function DocumentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If loading session, show simple loading indicator
  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading session...</p>
        </div>
      </Layout>
    );
  }

  // If no session and not loading, redirect to login
  if (!session && status !== 'loading') {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <Placeholder
          title="Document Management"
          description="Securely store, organize, and manage employee documents and files."
        />
      </div>
    </Layout>
  );
}