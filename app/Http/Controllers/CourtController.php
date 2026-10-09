<?php

namespace App\Http\Controllers;

use App\Models\Court;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourtController extends Controller
{
    public function index(): Response
    {
        $courts = Court::withCount(['bookings', 'activeBookings'])->latest()->get();

        return Inertia::render('Courts/Index', [
            'courts' => $courts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'type'           => 'required|in:indoor,outdoor',
            'surface'        => 'required|string|max:100',
            'price_per_hour' => 'required|numeric|min:0',
            'is_available'   => 'boolean',
            'description'    => 'nullable|string',
        ]);

        Court::create($validated);

        return redirect()->back()->with('success', 'Court created successfully!');
    }

    public function update(Request $request, Court $court)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'type'           => 'required|in:indoor,outdoor',
            'surface'        => 'required|string|max:100',
            'price_per_hour' => 'required|numeric|min:0',
            'is_available'   => 'boolean',
            'description'    => 'nullable|string',
        ]);

        $court->update($validated);

        return redirect()->back()->with('success', 'Court updated successfully!');
    }

    public function destroy(Court $court)
    {
        $court->delete();

        return redirect()->back()->with('success', 'Court deleted successfully!');
    }
}
