import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const PRIORITY = {
    high: { bar: 'bg-rose-500', label: 'High', chip: 'bg-rose-50 text-rose-700' },
    medium: { bar: 'bg-amber-400', label: 'Medium', chip: 'bg-amber-50 text-amber-700' },
    low: { bar: 'bg-slate-300', label: 'Low', chip: 'bg-slate-100 text-slate-600' },
};

const TABS = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'To do' },
    { value: 'completed', label: 'Done' },
];

function dueLabel(value) {
    const due = new Date(value + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((due - today) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff === -1) return 'Yesterday';
    return due.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: due.getFullYear() === today.getFullYear() ? undefined : 'numeric',
    });
}

const icon = 'h-4 w-4';

const PlusIcon = () => (
    <svg className={icon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
            fillRule="evenodd"
            d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
            clipRule="evenodd"
        />
    </svg>
);

const PencilIcon = () => (
    <svg className={icon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M13.6 2.6a2 2 0 112.8 2.8L7.5 14.3 3.5 15.5l1.2-4 8.9-8.9z" />
    </svg>
);

const TrashIcon = () => (
    <svg className={icon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
            fillRule="evenodd"
            d="M8 2a1 1 0 00-1 1v1H4a1 1 0 000 2h1v10a2 2 0 002 2h6a2 2 0 002-2V6h1a1 1 0 100-2h-3V3a1 1 0 00-1-1H8zm1 2V4h2v0H9zm-1 4a1 1 0 112 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z"
            clipRule="evenodd"
        />
    </svg>
);

const SearchIcon = () => (
    <svg className={icon} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.9 3.5l3.8 3.8a1 1 0 01-1.4 1.4l-3.8-3.8A6 6 0 012 8z"
            clipRule="evenodd"
        />
    </svg>
);

function TaskRow({ task }) {
    const completed = task.status === 'completed';
    const priority = PRIORITY[task.priority] ?? PRIORITY.medium;

    const toggle = () =>
        router.patch(route('tasks.toggle', task.id), {}, { preserveScroll: true });

    const destroy = () => {
        if (confirm(`Delete "${task.title}"?`)) {
            router.delete(route('tasks.destroy', task.id), { preserveScroll: true });
        }
    };

    return (
        <li className="group relative flex items-start gap-3 py-4 pl-5 pr-3 sm:pr-4">
            <span
                className={`absolute bottom-3 left-0 top-3 w-1 rounded-r-full ${priority.bar} ${
                    completed ? 'opacity-30' : ''
                }`}
            />

            <button
                onClick={toggle}
                aria-label={completed ? 'Mark as to do' : 'Mark as done'}
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                    completed
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-slate-300 text-transparent hover:border-teal-500 hover:text-teal-500'
                }`}
            >
                <CheckIcon />
            </button>

            <div className="min-w-0 flex-1">
                <p
                    className={`text-[15px] font-medium leading-6 ${
                        completed ? 'text-slate-400 line-through' : 'text-slate-900'
                    }`}
                >
                    {task.title}
                </p>

                {task.description && (
                    <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">{task.description}</p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className={`rounded-md px-2 py-0.5 font-medium ${priority.chip}`}>
                        {priority.label}
                    </span>
                    {task.due_date && (
                        <span
                            className={`rounded-md px-2 py-0.5 font-medium ${
                                task.is_overdue && !completed
                                    ? 'bg-rose-50 text-rose-700'
                                    : 'bg-slate-100 text-slate-600'
                            }`}
                        >
                            {task.is_overdue && !completed ? 'Overdue · ' : 'Due '}
                            {dueLabel(task.due_date)}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 transition focus-within:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                <Link
                    href={route('tasks.edit', task.id)}
                    aria-label="Edit task"
                    className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                    <PencilIcon />
                </Link>
                <button
                    onClick={destroy}
                    aria-label="Delete task"
                    className="rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                    <TrashIcon />
                </button>
            </div>
        </li>
    );
}

export default function Index({ tasks, filters, stats }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const status = filters.status ?? '';
    const firstRender = useRef(true);

    const visit = (params) => {
        const query = Object.fromEntries(Object.entries(params).filter(([, v]) => v));
        router.get(route('tasks.index'), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    // Live search, debounced
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const id = setTimeout(() => visit({ search, status }), 300);
        return () => clearTimeout(id);
    }, [search]);

    const total = stats?.total ?? 0;
    const completed = stats?.completed ?? 0;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    const hasFilters = Boolean(search || status);

    return (
        <AuthenticatedLayout>
            <Head title="My tasks" />

            <div className="py-8 sm:py-10">
                <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* Title + action */}
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                My tasks
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                {total === 0
                                    ? 'Nothing planned yet.'
                                    : `${completed} of ${total} done`}
                            </p>
                        </div>
                        <Link
                            href={route('tasks.create')}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                        >
                            <PlusIcon />
                            New task
                        </Link>
                    </div>

                    {/* Progress */}
                    {total > 0 && (
                        <div
                            className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
                            role="progressbar"
                            aria-valuenow={percent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Tasks completed"
                        >
                            <div
                                className="h-full rounded-full bg-teal-600 transition-all duration-500"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    )}

                    {flash?.success && (
                        <div
                            role="status"
                            className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800"
                        >
                            {flash.success}
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="inline-flex rounded-lg bg-slate-200/70 p-1" role="tablist">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.value}
                                    role="tab"
                                    aria-selected={status === tab.value}
                                    onClick={() => visit({ search, status: tab.value })}
                                    className={`rounded-md px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                                        status === tab.value
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="relative sm:w-64">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                                <SearchIcon />
                            </span>
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search tasks"
                                aria-label="Search tasks"
                                className="w-full rounded-lg border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {tasks.data.length === 0 ? (
                            <div className="px-6 py-14 text-center">
                                <p className="font-medium text-slate-900">
                                    {hasFilters ? 'No tasks match your filters' : 'No tasks yet'}
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    {hasFilters
                                        ? 'Try a different search or switch tabs.'
                                        : 'Add your first task to get started.'}
                                </p>
                                <div className="mt-5">
                                    {hasFilters ? (
                                        <Link
                                            href={route('tasks.index')}
                                            className="text-sm font-medium text-teal-700 hover:underline"
                                        >
                                            Clear filters
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('tasks.create')}
                                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
                                        >
                                            <PlusIcon />
                                            New task
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {tasks.data.map((task) => (
                                    <TaskRow key={task.id} task={task} />
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Pagination */}
                    {tasks.links.length > 3 && (
                        <nav className="flex flex-wrap justify-center gap-1" aria-label="Pagination">
                            {tasks.links.map((link, i) =>
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        preserveScroll
                                        className={`rounded-md px-3 py-1.5 text-sm ${
                                            link.active
                                                ? 'bg-slate-900 text-white'
                                                : 'text-slate-600 hover:bg-slate-200'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="rounded-md px-3 py-1.5 text-sm text-slate-300"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            )}
                        </nav>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}