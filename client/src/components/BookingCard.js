export default function BookingCard({ booking }) {
  return (
    <div className="border rounded p-3">
      <h3 className="font-semibold">Booking #{booking.id}</h3>
      <p>Guest: {booking.guestName}</p>
      <p>From: {booking.startDate}</p>
      <p>To: {booking.endDate}</p>
    </div>
  );
}
