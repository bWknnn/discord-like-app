import Profile from "../profile/Profile";

export default function User() {
  return (
    <>
      <div className="flex-1/12 plane">
        <div>
          <Profile name="bWkn" customClass="profile" />
        </div>
        <div>Settings</div>
      </div>
    </>
  );
}
