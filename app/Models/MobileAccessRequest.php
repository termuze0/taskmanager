<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MobileAccessRequest extends Model
{
    protected $fillable = ['user_id', 'status', 'reason', 'reviewed_by', 'reviewed_at'];

    protected $casts = ['reviewed_at' => 'datetime'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}