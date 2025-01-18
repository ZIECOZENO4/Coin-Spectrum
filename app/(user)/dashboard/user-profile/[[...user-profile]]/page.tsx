import { UserProfile } from "@clerk/nextjs";
 
const UserProfilePage = () => (
    <div className=" bg-black overflow-x-hidden">
  <UserProfile path="/dashboard/user-profile" routing="path" />
    </div>

);
 
export default UserProfilePage;