import { getLocationsList } from "@/lib/db/queries";
import { LocationsTable } from "@/components/dashboard/locations-table";

export default async function LocationsPage() {
  const locations = await getLocationsList();

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden p-4 h-full">
      <div className="mx-auto w-full space-y-4">
        <div>
          <h2 className="text-lg font-medium text-foreground">All Locations</h2>
          <p className="text-sm text-muted-foreground">
            Browse and search across all {locations.length} healthcare stores.
          </p>
        </div>
        <LocationsTable locations={locations} />
      </div>
    </div>
  );
}
