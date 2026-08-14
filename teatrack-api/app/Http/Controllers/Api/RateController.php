<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateRateRequest;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RateController extends Controller
{
    public function index(): JsonResponse
    {
        $setting = Setting::current();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'No rates configured yet.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => [
                'teaRate'    => (float) $setting->tea_rate,
                'coffeeRate' => (float) $setting->coffee_rate,
                'updatedAt'  => $setting->updated_at?->toDateTimeString(),
                'updatedBy'  => $setting->updatedBy?->name ?? '—',
            ],
        ], 200);
    }

    public function update(UpdateRateRequest $request): JsonResponse
    {
        // Only super_admin can update rates (enforced in routes via middleware)
        $setting = Setting::create([
            'tea_rate'    => $request->teaRate,
            'coffee_rate' => $request->coffeeRate,
            'updated_by'  => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Rates updated successfully.',
            'data'    => [
                'teaRate'    => (float) $setting->tea_rate,
                'coffeeRate' => (float) $setting->coffee_rate,
                'updatedAt'  => $setting->updated_at?->toDateTimeString(),
            ],
        ], 200);
    }
}
