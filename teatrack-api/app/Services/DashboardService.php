<?php

namespace App\Services;

use App\Models\Entry;
use App\Models\Setting;

class DashboardService
{
    public function getMonthlyData(int $month, int $year): array
    {
        $entries = Entry::whereMonth('date', $month)
            ->whereYear('date', $year)
            ->orderBy('date')
            ->get();

        $totalTea     = $entries->sum('tea_quantity');
        $totalCoffee  = $entries->sum('coffee_quantity');
        $totalCups    = $entries->sum('total_cups');
        $teaExpense   = $entries->sum('tea_expense');
        $coffeeExpense = $entries->sum('coffee_expense');
        $totalExpense = $entries->sum('total_expense');

        $teaPercentage    = $totalCups > 0 ? round(($totalTea    / $totalCups) * 100) : 0;
        $coffeePercentage = $totalCups > 0 ? round(($totalCoffee / $totalCups) * 100) : 0;

        $setting = Setting::current();

        $recentEntries = $entries->sortByDesc('date')->take(5)->values()->map(function ($e) {
            return [
                'id'              => $e->id,
                'date'            => $e->date->format('Y-m-d'),
                'tea_quantity'    => $e->tea_quantity,
                'coffee_quantity' => $e->coffee_quantity,
                'total_cups'      => $e->total_cups,
                'total_expense'   => (float) $e->total_expense,
                'added_by'        => $e->creator?->name ?? '—',
            ];
        });

        return [
            'month'             => date('F', mktime(0, 0, 0, $month, 1)),
            'year'              => $year,
            'totalTea'          => (int) $totalTea,
            'totalCoffee'       => (int) $totalCoffee,
            'totalCups'         => (int) $totalCups,
            'teaRate'           => $setting ? (float) $setting->tea_rate : 0,
            'coffeeRate'        => $setting ? (float) $setting->coffee_rate : 0,
            'teaExpense'        => (float) $teaExpense,
            'coffeeExpense'     => (float) $coffeeExpense,
            'totalExpense'      => (float) $totalExpense,
            'teaPercentage'     => $teaPercentage,
            'coffeePercentage'  => $coffeePercentage,
            'recentEntries'     => $recentEntries,
        ];
    }
}
