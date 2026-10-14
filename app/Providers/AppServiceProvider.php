<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Passport::tokensCan([
            'web'        => 'Web access',
            'mobile'     => 'Mobile app access',
            'mobile-key' => 'Marker: user may log in from mobile',
        ]);

        Gate::define('manage-users', fn (User $user) => (bool) $user->is_admin);
    }
}