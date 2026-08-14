<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $dashboardService) {}

    public function index(Request $request): JsonResponse
    {
        $month = (int) ($request->query('month', date('n')));
        $year  = (int) ($request->query('year',  date('Y')));

        $data = $this->dashboardService->getMonthlyData($month, $year);

        return response()->json([
            'success' => true,
            'data'    => $data,
        ], 200);
    }
}
