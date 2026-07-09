import Friend from "../friendlist/Friend";

export default function Profile() {
  return (
    <>
      <div className="flex-1/12 plane">
        <div>
          <Friend name="bWkn" customClass="profile" />
        </div>
        <div>Settings</div>
      </div>
    </>
  );
}
