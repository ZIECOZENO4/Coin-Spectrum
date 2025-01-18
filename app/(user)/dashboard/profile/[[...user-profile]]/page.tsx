import { UserProfile } from "@clerk/nextjs";
 
const UserProfilePage = () => (
    <div className=" bg-black w-[100vw] overflow-x-hidden">
  <UserProfile path="/user-profile" routing="path" />
    </div>

);
 
export default UserProfilePage;