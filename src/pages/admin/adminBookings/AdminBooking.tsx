import BookingFilters from "./BookingFilters";
import BookingHeader from "./BookingHeader";
import AdminBookingsTable from "./AdminBookingsTable";

export default function AdminBooking() {
  return (
    <section>
      <BookingHeader />

      <BookingFilters />

      <div className="mt-6">
        <AdminBookingsTable />
      </div>
    </section>
  );
}