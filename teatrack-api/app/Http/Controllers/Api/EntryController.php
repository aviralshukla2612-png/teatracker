<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEntryRequest;
use App\Http\Requests\UpdateEntryRequest;
use App\Models\Entry;
use App\Services\EntryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EntryController extends Controller
{
    public function __construct(private EntryService $entryService) {}

    public function index(Request $request): JsonResponse
    {
        $query = Entry::with('creator')->orderBy('date', 'desc');

        if ($request->filled('month') && $request->filled('year')) {
            $query->whereMonth('date', $request->month)
                  ->whereYear('date', $request->year);
        }

        $entries = $query->get()->map(fn($e) => $this->formatEntry($e));

        return response()->json(['success' => true, 'data' => $entries], 200);
    }

    public function store(StoreEntryRequest $request): JsonResponse
    {
        // Sub admins can only create entries for today
        if ($request->user()->role !== 'super_admin' && $request->date !== now()->format('Y-m-d')) {
            return response()->json([
                'success' => false,
                'message' => 'Sub Admins can only create entries for today.',
            ], 403);
        }

        // Check for duplicate date
        if (Entry::where('date', $request->date)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'An entry already exists for this date.',
            ], 409);
        }

        $calculated = $this->entryService->calculateFromCurrent(
            $request->tea_quantity,
            $request->coffee_quantity
        );

        $entry = Entry::create(array_merge($calculated, [
            'date'       => $request->date,
            'created_by' => $request->user()->id,
        ]));

        $entry->load('creator');

        return response()->json([
            'success' => true,
            'message' => 'Entry created successfully.',
            'data'    => $this->formatEntry($entry),
        ], 201);
    }

    public function show(Entry $entry): JsonResponse
    {
        $entry->load('creator');

        return response()->json(['success' => true, 'data' => $this->formatEntry($entry)], 200);
    }

    public function update(UpdateEntryRequest $request, Entry $entry): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'super_admin' && $entry->created_by !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You can only edit your own entries.',
            ], 403);
        }
        
        // Sub admins can only edit today's entries
        if ($user->role !== 'super_admin' && $entry->date->format('Y-m-d') !== now()->format('Y-m-d')) {
            return response()->json([
                'success' => false,
                'message' => 'Sub Admins can only edit entries for today.',
            ], 403);
        }

        $teaQty    = $request->input('tea_quantity',    $entry->tea_quantity);
        $coffeeQty = $request->input('coffee_quantity', $entry->coffee_quantity);

        // Use stored snapshot rates to preserve historical accuracy
        $calculated = $this->entryService->calculateFromSnapshot(
            $teaQty,
            $coffeeQty,
            (float) $entry->tea_rate,
            (float) $entry->coffee_rate
        );

        // Check for duplicate date if date is being changed
        if ($request->filled('date') && $request->date !== $entry->date->format('Y-m-d')) {
            if ($user->role !== 'super_admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Sub Admins cannot change the date of an entry.',
                ], 403);
            }
            
            if (Entry::where('date', $request->date)->where('id', '!=', $entry->id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'An entry already exists for this date.',
                ], 409);
            }
            $calculated['date'] = $request->date;
        }

        $entry->update($calculated);
        $entry->load('creator');

        return response()->json([
            'success' => true,
            'message' => 'Entry updated successfully.',
            'data'    => $this->formatEntry($entry),
        ], 200);
    }

    public function destroy(Request $request, Entry $entry): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'super_admin' && $entry->created_by !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You can only delete your own entries.',
            ], 403);
        }

        $entry->delete();

        return response()->json([
            'success' => true,
            'message' => 'Entry deleted successfully.',
        ], 200);
    }

    private function formatEntry(Entry $entry): array
    {
        return [
            'id'              => $entry->id,
            'date'            => $entry->date->format('Y-m-d'),
            'tea_quantity'    => $entry->tea_quantity,
            'coffee_quantity' => $entry->coffee_quantity,
            'total_cups'      => $entry->total_cups,
            'tea_rate'        => (float) $entry->tea_rate,
            'coffee_rate'     => (float) $entry->coffee_rate,
            'tea_expense'     => (float) $entry->tea_expense,
            'coffee_expense'  => (float) $entry->coffee_expense,
            'total_expense'   => (float) $entry->total_expense,
            'added_by'        => $entry->creator?->name ?? '—',
            'created_by'      => $entry->created_by,
            'created_at'      => $entry->created_at?->toDateTimeString(),
            'updated_at'      => $entry->updated_at?->toDateTimeString(),
        ];
    }
}
