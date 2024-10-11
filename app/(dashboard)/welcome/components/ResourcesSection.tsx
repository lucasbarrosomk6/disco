import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ResourcesSection() {
  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-4">Educational Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Video Tutorial</h3>
          <Link href="/tutorial">
            <Button variant="outline">Watch 2-minute overview</Button>
          </Link>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Knowledge Base</h3>
          <Link href="/help">
            <Button variant="outline">Browse FAQs and Guides</Button>
          </Link>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Customer Support</h3>
          <Link href="/support">
            <Button variant="outline">Contact Support Team</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}