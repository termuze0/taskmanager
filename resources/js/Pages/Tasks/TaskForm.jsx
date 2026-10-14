import { useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

const fieldClass =
    'mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

export default function TaskForm({ task = null }) {
    const isEdit = Boolean(task);

    const { data, setData, post, put, processing, errors } = useForm({
        title: task?.title ?? '',
        description: task?.description ?? '',
        priority: task?.priority ?? 'medium',
        due_date: task?.due_date ?? '',
        status: task?.status ?? 'pending',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('tasks.update', task.id));
        } else {
            post(route('tasks.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <InputLabel htmlFor="title" value="Title" />
                <TextInput
                    id="title"
                    className="mt-1 block w-full"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    isFocused
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="description" value="Description" />
                <textarea
                    id="description"
                    rows={4}
                    className={fieldClass}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <InputLabel htmlFor="priority" value="Priority" />
                    <select
                        id="priority"
                        className={fieldClass}
                        value={data.priority}
                        onChange={(e) => setData('priority', e.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <InputError message={errors.priority} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="due_date" value="Due date" />
                    <TextInput
                        id="due_date"
                        type="date"
                        className="mt-1 block w-full"
                        value={data.due_date ?? ''}
                        onChange={(e) => setData('due_date', e.target.value)}
                    />
                    <InputError message={errors.due_date} className="mt-2" />
                </div>

                {isEdit && (
                    <div>
                        <InputLabel htmlFor="status" value="Status" />
                        <select
                            id="status"
                            className={fieldClass}
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 pt-2">
                <PrimaryButton disabled={processing}>
                    {isEdit ? 'Save Changes' : 'Create Task'}
                </PrimaryButton>
                <Link href={route('tasks.index')} className="text-sm text-gray-600 hover:underline">
                    Cancel
                </Link>
            </div>
        </form>
    );
}