interface Student {
    name: string;
    age: number;
}

const students : Student[] = [
    {name: "Alice", age: 20},
    {name: "Bob", age: 21},
    {name: "Charlie", age: 22}
];

export async function getStudents(limit: number) {
    if (limit < 0) {
        throw new Error("Limit must be a positive number");
    }
    return new Promise<Student[]>((resolve, reject) => {
        setTimeout(() => {
            resolve(students.slice(0, limit));
        },1000);
    });
}

export {}