<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::where('role', 'sub_admin')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($u) => $this->formatUser($u));

        return response()->json(['success' => true, 'data' => $users], 200);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role'      => 'sub_admin',
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sub Admin created successfully.',
            'data'    => $this->formatUser($user),
        ], 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $this->formatUser($user)], 200);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'name'     => ['sometimes', 'string', 'max:255'],
            'email'    => ['sometimes', 'email', 'unique:users,email,' . $user->id],
            'password' => ['sometimes', 'string', 'min:6'],
        ]);

        $data = $request->only('name', 'email');
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'data'    => $this->formatUser($user->fresh()),
        ], 200);
    }

    public function toggleStatus(User $user): JsonResponse
    {
        if ($user->role === 'super_admin') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot change status of Super Admin.',
            ], 403);
        }

        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'User status updated.',
            'data'    => $this->formatUser($user->fresh()),
        ], 200);
    }

    public function destroy(User $user): JsonResponse
    {
        // Prevent deleting the last super_admin
        if ($user->role === 'super_admin') {
            $superAdminCount = User::where('role', 'super_admin')->count();
            if ($superAdminCount <= 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete the last Super Admin.',
                ], 403);
            }
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.',
        ], 200);
    }

    private function formatUser(User $user): array
    {
        return [
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'role'       => $user->role,
            'is_active'  => $user->is_active,
            'status'     => $user->is_active ? 'Active' : 'Inactive',
            'created_at' => $user->created_at?->toDateString(),
        ];
    }
}
