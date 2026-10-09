<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Court;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create default admin user
        User::factory()->create([
            'name'  => 'Admin Padel',
            'email' => 'admin@padel.com',
        ]);

        // Create courts
        $courts = [
            [
                'name'           => 'Court A - Premium Indoor',
                'type'           => 'indoor',
                'surface'        => 'Artificial Grass',
                'price_per_hour' => 150000,
                'is_available'   => true,
                'description'    => 'Premium indoor court with air conditioning, LED lighting, and glass walls.',
            ],
            [
                'name'           => 'Court B - Indoor Classic',
                'type'           => 'indoor',
                'surface'        => 'Artificial Grass',
                'price_per_hour' => 120000,
                'is_available'   => true,
                'description'    => 'Classic indoor court with standard lighting and good ventilation.',
            ],
            [
                'name'           => 'Court C - Outdoor',
                'type'           => 'outdoor',
                'surface'        => 'Concrete',
                'price_per_hour' => 80000,
                'is_available'   => true,
                'description'    => 'Open-air court with great natural lighting, perfect for morning sessions.',
            ],
            [
                'name'           => 'Court D - Outdoor Premium',
                'type'           => 'outdoor',
                'surface'        => 'Artificial Grass',
                'price_per_hour' => 100000,
                'is_available'   => true,
                'description'    => 'Premium outdoor court with professional artificial grass surface.',
            ],
        ];

        foreach ($courts as $court) {
            Court::create($court);
        }

        // Create sample bookings
        $statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        $names    = ['Budi Santoso', 'Dewi Rahayu', 'Ahmad Fauzi', 'Siti Nurhaliza', 'Raka Pratama', 'Lina Wijaya'];

        for ($i = 0; $i < 20; $i++) {
            $court     = Court::inRandomOrder()->first();
            $startHour = rand(8, 20);
            $duration  = rand(1, 3);
            $date      = now()->addDays(rand(-7, 14));

            Booking::create([
                'court_id'       => $court->id,
                'customer_name'  => $names[array_rand($names)],
                'customer_phone' => '08' . rand(100000000, 999999999),
                'customer_email' => 'customer' . $i . '@email.com',
                'booking_date'   => $date->format('Y-m-d'),
                'start_time'     => sprintf('%02d:00:00', $startHour),
                'end_time'       => sprintf('%02d:00:00', $startHour + $duration),
                'duration_hours' => $duration,
                'total_price'    => $court->price_per_hour * $duration,
                'status'         => $statuses[array_rand($statuses)],
                'notes'          => rand(0, 1) ? 'Mohon siapkan shuttlecock.' : null,
            ]);
        }
    }
}
