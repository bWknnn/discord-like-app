export default function Topnav() {
  return (
    <>
      <div className="flex flex-col plane gap-2  flex-1/12">
        <p className="border-left border-2 rounded-2xl hover:bg-left cursor-pointer text-center">
          Add Friend
        </p>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search for friend"
          autoComplete="off"
          className="p-2 border-left border-2 rounded-2xl leading-0.5 outline-none "
        />
      </div>
    </>
  );
}
