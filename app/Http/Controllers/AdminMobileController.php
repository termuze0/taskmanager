<?php 
namespace App\Http\Controllers;

use App\Models\User;

class AdminMobileController extends Controller
{
    public function enable(User $user)
    {
        // remove any old key first
        $user->tokens()->where('name', 'mobile-key')->delete();

        $key = $user->createToken('mobile-key', ['mobile-key']);
        $key->token->update(['expires_at' => now()->addYears(10)]);

        return ['message' => 'Mobile access enabled'];
    }

    public function disable(User $user)
    {
        // revoke the key AND any phone sessions already logged in
        $user->tokens()
            ->whereIn('name', ['mobile-key', 'mobile'])
            ->each(fn ($t) => $t->revoke());

        return ['message' => 'Mobile access disabled'];
    }
}