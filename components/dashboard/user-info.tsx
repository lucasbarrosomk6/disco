interface User {
  id: string;
  name: string;
  email: string;
  // Add other relevant fields
}

export function UserInfo({ user }: { user: User | null }) {
  if (!user) return <div>No user information available</div>;

  return (
    <div>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      {/* Add other user information as needed */}
    </div>
  );
}
