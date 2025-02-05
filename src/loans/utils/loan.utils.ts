export function calculateDueDate(): Date {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    return dueDate;
}

export function calculateFine(dueDate: Date): number {
    const today = new Date();
    const diffTime = Math.max(0, today.getTime() - dueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 2;
}