<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create Super Admin
        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@teatrack.com'],
            [
                'name'      => 'Super Admin',
                'password'  => Hash::make(env('SUPER_ADMIN_PASSWORD', 'super123')),
                'role'      => 'super_admin',
                'is_active' => true,
            ]
        );

        // Create Sub Admin
        User::firstOrCreate(
            ['email' => 'subadmin1@teatrack.com'],
            [
                'name'      => 'Sub Admin',
                'password'  => Hash::make(env('SUB_ADMIN_PASSWORD', 'sub123')),
                'role'      => 'sub_admin',
                'is_active' => true,
            ]
        );

        // Create default settings (only if none exist)
        if (Setting::count() === 0) {
            Setting::create([
                'tea_rate'    => 10.00,
                'coffee_rate' => 15.00,
                'updated_by'  => $superAdmin->id,
            ]);
        }

        $this->command->info('✅ Super Admin, Sub Admin, and default settings seeded.');
    }
}
