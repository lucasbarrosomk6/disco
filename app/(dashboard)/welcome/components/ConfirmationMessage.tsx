import React from 'react';

interface ConfirmationMessageProps {
  userName: string;
  planName: string;
}

export default function ConfirmationMessage({ userName, planName }: ConfirmationMessageProps) {
  return (
    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8" role="alert">
      <h2 className="font-bold">Thank You for Joining Disco.ai!</h2>
      <p>Your payment was successful, and your account has been upgraded to the {planName} plan.</p>
      <p className="mt-2">Welcome aboard, {userName}! We're excited to have you with us. Let's get started on accelerating your sales process!</p>
    </div>
  );
}