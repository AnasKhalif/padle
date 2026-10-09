<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Court;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Booking::with('court')
            ->when($request->search, fn($q) => $q->where('customer_name', 'like', "%{$request->search}%")
                ->orWhere('customer_phone', 'like', "%{$request->search}%"))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->date, fn($q) => $q->whereDate('booking_date', $request->date))
            ->latest();

        $bookings = $query->paginate(10)->withQueryString();
        $courts = Court::where('is_available', true)->get(['id', 'name', 'price_per_hour', 'type']);

        $stats = [
            'total'     => Booking::count(),
            'pending'   => Booking::where('status', 'pending')->count(),
            'confirmed' => Booking::where('status', 'confirmed')->count(),
            'today'     => Booking::whereDate('booking_date', today())->count(),
            'revenue'   => Booking::whereIn('status', ['confirmed', 'completed'])->sum('total_price'),
        ];

        return Inertia::render('Bookings/Index', [
            'bookings' => $bookings,
            'courts'   => $courts,
            'stats'    => $stats,
            'filters'  => $request->only(['search', 'status', 'date']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'court_id'       => 'required|exists:courts,id',
            'customer_name'  => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email',
            'booking_date'   => 'required|date|after_or_equal:today',
            'start_time'     => 'required',
            'end_time'       => 'required|after:start_time',
            'notes'          => 'nullable|string',
        ]);

        $court = Court::findOrFail($validated['court_id']);
        $start = \Carbon\Carbon::parse($validated['start_time']);
        $end   = \Carbon\Carbon::parse($validated['end_time']);
        $hours = $end->diffInHours($start);

        $validated['duration_hours'] = $hours;
        $validated['total_price']    = $court->price_per_hour * $hours;
        $validated['status']         = 'pending';

        Booking::create($validated);

        return redirect()->back()->with('success', 'Booking created successfully!');
    }

    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'court_id'       => 'required|exists:courts,id',
            'customer_name'  => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email',
            'booking_date'   => 'required|date',
            'start_time'     => 'required',
            'end_time'       => 'required|after:start_time',
            'status'         => 'required|in:pending,confirmed,cancelled,completed',
            'notes'          => 'nullable|string',
        ]);

        $court = Court::findOrFail($validated['court_id']);
        $start = \Carbon\Carbon::parse($validated['start_time']);
        $end   = \Carbon\Carbon::parse($validated['end_time']);
        $hours = $end->diffInHours($start);

        $validated['duration_hours'] = $hours;
        $validated['total_price']    = $court->price_per_hour * $hours;

        $booking->update($validated);

        return redirect()->back()->with('success', 'Booking updated successfully!');
    }

    public function destroy(Booking $booking)
    {
        $booking->delete();

        return redirect()->back()->with('success', 'Booking deleted successfully!');
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $request->validate(['status' => 'required|in:pending,confirmed,cancelled,completed']);
        $booking->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Status updated!');
    }
}
