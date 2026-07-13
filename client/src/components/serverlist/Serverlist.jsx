import Server from "./Server";

export default function Serverlist() {
  return (
    <>
      <div className="flex-9/12 plane overflow-y-auto flex flex-col gap-1">
        <Server name="Ahmet" customClass="friend" />
        <Server name="Ali" customClass="friend" />
        <Server name="Can" customClass="friend" />
        <Server name="Burak" customClass="friend" />
        <Server name="Emre" customClass="friend" />
        <Server name="Mahmut" customClass="friend" />
        <Server name="Afruz" customClass="friend" />
        <Server name="Mehmet" customClass="friend" />
        <Server name="Ayşe" customClass="friend" />
        <Server name="Ceren" customClass="friend" />
        <Server name="Gül" customClass="friend" />
        <Server name="Ece" customClass="friend" />
      </div>
    </>
  );
}
