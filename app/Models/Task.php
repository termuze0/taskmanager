<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = ['title', 'description', 'status', 'priority', 'due_date'];

  


    protected $appends = ['is_overdue'];

protected function casts(): array
{
    return ['due_date' => 'date:Y-m-d'];
}

public function getIsOverdueAttribute(): bool
{
    return $this->isOverdue();
}





    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isOverdue(): bool
    {
        return ! $this->isCompleted() && $this->due_date && $this->due_date->isPast();
    }
}