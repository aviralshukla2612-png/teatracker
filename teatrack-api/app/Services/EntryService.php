<?php

namespace App\Services;

use App\Models\Entry;
use App\Models\Setting;
use App\Models\User;

class EntryService
{
    /**
     * Calculate and build entry data from quantities + snapshot rates.
     */
    public function calculateFromCurrent(int $teaQty, int $coffeeQty): array
    {
        $setting = Setting::current();

        if (!$setting) {
            abort(500, 'No settings found. Please seed default rates.');
        }

        $teaRate    = (float) $setting->tea_rate;
        $coffeeRate = (float) $setting->coffee_rate;

        return $this->calculate($teaQty, $coffeeQty, $teaRate, $coffeeRate);
    }

    /**
     * Calculate using an existing snapshot rate (for edits).
     */
    public function calculateFromSnapshot(int $teaQty, int $coffeeQty, float $teaRate, float $coffeeRate): array
    {
        return $this->calculate($teaQty, $coffeeQty, $teaRate, $coffeeRate);
    }

    private function calculate(int $teaQty, int $coffeeQty, float $teaRate, float $coffeeRate): array
    {
        $teaExpense    = $teaQty    * $teaRate;
        $coffeeExpense = $coffeeQty * $coffeeRate;
        $totalCups     = $teaQty   + $coffeeQty;
        $totalExpense  = $teaExpense + $coffeeExpense;

        return [
            'tea_quantity'    => $teaQty,
            'coffee_quantity' => $coffeeQty,
            'total_cups'      => $totalCups,
            'tea_rate'        => $teaRate,
            'coffee_rate'     => $coffeeRate,
            'tea_expense'     => $teaExpense,
            'coffee_expense'  => $coffeeExpense,
            'total_expense'   => $totalExpense,
        ];
    }
}
