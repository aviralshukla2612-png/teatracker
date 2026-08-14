<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(private ReportService $reportService) {}

    public function monthly(Request $request): JsonResponse
    {
        $month = (int) ($request->query('month', date('n')));
        $year  = (int) ($request->query('year',  date('Y')));

        $data = $this->reportService->getMonthlySummary($month, $year);

        return response()->json([
            'success' => true,
            'data'    => $data,
        ], 200);
    }
}
