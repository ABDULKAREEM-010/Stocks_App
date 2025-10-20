import { getUserWatchlist } from "@/lib/actions/watchlist.action";
import WatchlistTable from "@/components/WatchlistTable";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function WatchlistPage() {
  // Check if user is authenticated
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session?.user) {
    redirect('/sign-in');
  }

  const watchlist = await getUserWatchlist();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            My Watchlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your favorite stocks and monitor their performance
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden">
          <WatchlistTable watchlist={watchlist} />
        </div>

        {watchlist.length > 0 && (
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <p>
              You have {watchlist.length} {watchlist.length === 1 ? 'stock' : 'stocks'} in your watchlist.
              Stock prices update every minute.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
