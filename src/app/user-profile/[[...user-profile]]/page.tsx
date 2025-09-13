
import { UserProfile } from '@clerk/nextjs';

const UserProfilePage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <UserProfile path="/user-profile" />
  </div>
);

export default UserProfilePage;
