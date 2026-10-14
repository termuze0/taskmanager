<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;


class TaskController extends Controller
{
    private function wantsApi(Request $request): bool
    {
        return $request->is('api/*')
            || ($request->expectsJson() && ! $request->header('X-Inertia'));
    }

    public function index(Request $request): InertiaResponse|JsonResponse
    {
        $perPage = min((int) $request->input('per_page', 10), 100);

        $tasks = $request->user()->tasks()
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->when($request->filled('search'), fn ($q) => $q->where('title', 'like', '%'.$request->search.'%'))
            ->orderByRaw("status = 'completed'")
            ->orderBy('due_date')
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        if ($this->wantsApi($request)) {
            return response()->json($tasks);
        }

        return Inertia::render('Tasks/Index', [
            'tasks'   => $tasks,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('Tasks/Create');
    }

    public function store(TaskRequest $request): RedirectResponse|JsonResponse
    {
        $task = $request->user()->tasks()->create($request->validated());

        if ($this->wantsApi($request)) {
            return response()->json($task->fresh(), 201);
        }

        return redirect()->route('tasks.index')->with('success', 'Task created.');
    }

    public function show(Task $task): JsonResponse
    {
        Gate::authorize('view', $task);

        return response()->json($task);
    }

    public function edit(Task $task): InertiaResponse
    {
        Gate::authorize('update', $task);

        return Inertia::render('Tasks/Edit', ['task' => $task]);
    }

    public function update(TaskRequest $request, Task $task): RedirectResponse|JsonResponse
    {
        Gate::authorize('update', $task);

        $task->update($request->validated());

        if ($this->wantsApi($request)) {
            return response()->json($task->fresh());
        }

        return redirect()->route('tasks.index')->with('success', 'Task updated.');
    }

    public function toggle(Request $request, Task $task): RedirectResponse|JsonResponse
    {
        Gate::authorize('update', $task);

        $task->update(['status' => $task->isCompleted() ? 'pending' : 'completed']);

        if ($this->wantsApi($request)) {
            return response()->json($task->fresh());
        }

        return back();
    }

    public function destroy(Request $request, Task $task): RedirectResponse|JsonResponse
    {
        Gate::authorize('delete', $task);

        $task->delete();

        if ($this->wantsApi($request)) {
            return response()->json(null, 204);
        }

        return redirect()->route('tasks.index')->with('success', 'Task deleted.');
    }
}