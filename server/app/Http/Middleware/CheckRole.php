<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = auth()->user();
        Log::info('CheckRole middleware', [
            'user_id' => $user ? $user->id : null,
            'user_email' => $user ? $user->email : null,
            'user_role' => $user ? $user->role : null,
            'expected_roles' => $roles,
            'auth_header' => $request->header('Authorization'),
        ]);
        if (!$user || !in_array($user->role, $roles)) {
            Log::warning('Forbidden in CheckRole', [
                'user_id' => $user ? $user->id : null,
                'user_email' => $user ? $user->email : null,
                'user_role' => $user ? $user->role : null,
                'expected_roles' => $roles,
                'auth_header' => $request->header('Authorization'),
            ]);
            return response()->json(['error' => 'Forbidden.'], 403);
        }
        return $next($request);
    }
}
