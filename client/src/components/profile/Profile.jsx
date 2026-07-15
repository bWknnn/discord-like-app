import profileIcon from "../../assets/pp.ico";

export default function Profile({ name, customClass }) {
  return (
    <>
      <div className={`${customClass}`}>
        <img src={profileIcon} className="w-10 h-10 rounded-full flex-1/5" />
        <p className="flex-4/5 ">{name}</p>
      </div>
    </>
  );
}
