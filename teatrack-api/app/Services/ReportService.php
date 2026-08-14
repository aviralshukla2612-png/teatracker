<?php

namespace App\Services;

use App\Models\Entry;

class ReportService
{
    public function getMonthlySummary(int $month, int $year): array
    {
        $entries = Entry::whereMonth('date', $month)
            ->whereYear('date', $year)
            ->with('creator')
            ->orderBy('date')
            ->get();

        $totalTea      = $entries->sum('tea_quantity');
        $totalCoffee   = $entries->sum('coffee_quantity');
        $totalCups     = $entries->sum('total_cups');
        $teaExpense    = $entries->sum('tea_expense');
        $coffeeExpense = $entries->sum('coffee_expense');
        $totalExpense  = $entries->sum('total_expense');
        $dayCount      = $entries->count();

        $avgDailyExpense = $dayCount > 0 ? round($totalExpense / $dayCount, 2) : 0;

        $highestDay = $entries->sortByDesc('total_cups')->first();
        $highestConsumptionDay = $highestDay ? [
            'date'            => $highestDay->date->format('Y-m-d'),
            'tea_quantity'    => $highestDay->tea_quantity,
            'coffee_quantity' => $highestDay->coffee_quantity,
            'total_cups'      => $highestDay->total_cups,
            'total_expense'   => (float) $highestDay->total_expense,
        ] : null;

        $dailyData = $entries->map(function ($e) {
            return [
                'id'              => $e->id,
                'date'            => $e->date->format('Y-m-d'),
                'tea_quantity'    => $e->tea_quantity,
                'coffee_quantity' => $e->coffee_quantity,
                'total_cups'      => $e->total_cups,
                'tea_expense'     => (float) $e->tea_expense,
                'coffee_expense'  => (float) $e->coffee_expense,
                'total_expense'   => (float) $e->total_expense,
                'added_by'        => $e->creator?->name ?? '—',
            ];
        })->values();

        return [
            'month'                   => date('F', mktime(0, 0, 0, $month, 1)),
            'year'                    => $year,
            'totalTea'                => (int) $totalTea,
            'totalCoffee'             => (int) $totalCoffee,
            'totalCups'               => (int) $totalCups,
            'teaExpense'              => (float) $teaExpense,
            'coffeeExpense'           => (float) $coffeeExpense,
            'totalExpense'            => (float) $totalExpense,
            'averageDailyExpense'     => (float) $avgDailyExpense,
            'highestConsumptionDay'   => $highestConsumptionDay,
            'dailyData'               => $dailyData,
        ];
    }
}
