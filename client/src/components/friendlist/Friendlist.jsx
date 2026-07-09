import Friend from "./Friend";

export default function Friendlist() {
  return (
    <>
      <div className="flex-9/12 plane overflow-y-auto flex flex-col gap-1">
        <Friend name="Ahmet" customClass="friend" />
        <Friend name="Ali" customClass="friend" />
        <Friend name="Can" customClass="friend" />
        <Friend name="Burak" customClass="friend" />
        <Friend name="Emre" customClass="friend" />
        <Friend name="Mahmut" customClass="friend" />
        <Friend name="Afruz" customClass="friend" />
        <Friend name="Mehmet" customClass="friend" />
        <Friend name="Ayşe" customClass="friend" />
        <Friend name="Ceren" customClass="friend" />
        <Friend name="Gül" customClass="friend" />
        <Friend name="Ece" customClass="friend" />
      </div>
    </>
  );
}
