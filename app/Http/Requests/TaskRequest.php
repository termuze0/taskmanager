<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'priority'    => ['required', 'in:low,medium,high'],
            'status'      => ['sometimes', 'in:pending,completed'],
            'due_date'    => ['nullable', 'date'],
        ];
    }
}