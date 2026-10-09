<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Court;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_courts'    => Court::count(),
            'available_courts' => Court::where('is_available', true)->count(),
            'total_bookings'  => Booking::count(),
            'today_bookings'  => Booking::whereDate('booking_date', today())->count(),
            'pending'         => Booking::where('status', 'pending')->count(),
            'confirmed'       => Booking::where('status', 'confirmed')->count(),
            'total_revenue'   => Booking::whereIn('status', ['confirmed', 'completed'])->sum('total_price'),
            'month_revenue'   => Booking::whereIn('status', ['confirmed', 'completed'])
                ->whereMonth('booking_date', now()->month)
                ->sum('total_price'),
        ];

        $recent_bookings = Booking::with('court')
            ->latest()
            ->take(5)
            ->get();

        $courts = Court::withCount('activeBookings')->get();

        return Inertia::render('Dashboard', [
            'stats'           => $stats,
            'recent_bookings' => $recent_bookings,
            'courts'          => $courts,
        ]);
    }
}
