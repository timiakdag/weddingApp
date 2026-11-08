export default function UserPanel({
  user,
  onSignOut
}) {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-2xl font-bold">
        Welcome
      </h1>

      <p>{user.email}</p>

      <button
        onClick={onSignOut}
        className="border p-2"
      >
        Sign Out
      </button>
    </div>
  );
}