import Profile from "../profile/Profile";

export default function Serverlist() {
  return (
    <>
      <div className="flex-9/12 plane overflow-y-auto flex flex-col gap-1">
        <Profile name="Ahmet" customClass="server" />
        <Profile name="Ali" customClass="server" />
        <Profile name="Can" customClass="server" />
        <Profile name="Burak" customClass="server" />
        <Profile name="Emre" customClass="server" />
        <Profile name="Mahmut" customClass="server" />
        <Profile name="Afruz" customClass="server" />
        <Profile name="Mehmet" customClass="server" />
        <Profile name="Ayşe" customClass="server" />
        <Profile name="Ceren" customClass="server" />
        <Profile name="Gül" customClass="server" />
        <Profile name="Ece" customClass="server" />
      </div>
    </>
  );
}
