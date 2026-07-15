export default function Topnav() {
  return (
    <>
      <div className="flex flex-col plane gap-2  flex-1/12">
        <p className="border-bg-card border-2 rounded-2xl hover:bg-bg-card cursor-pointer text-center text-accent-hover">
          Add Server
        </p>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search for a server"
          autoComplete="off"
          className="p-2 border-bg-card border-2 rounded-2xl leading-0.5 outline-none text-neutral-600 "
        />
      </div>
    </>
  );
}
