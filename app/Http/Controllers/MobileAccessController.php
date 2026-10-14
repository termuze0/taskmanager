<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MobileAccessController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('MobileAccess', [
            'latest' => $request->user()->mobileAccessRequests()->latest()->first(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $exists = $request->user()->mobileAccessRequests()
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        if ($exists) {
            return back()->withErrors(['reason' => 'You already have a pending or approved request.']);
        }

        $request->user()->mobileAccessRequests()->create([
            'reason' => $data['reason'] ?? null,
        ]);

        return redirect()->route('mobile.access');
    }
}