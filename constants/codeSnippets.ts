export const CODE_SNIPPETS = [
    {
        language: 'javascript',
        content: `const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};`
    },
    {
        language: 'python',
        content: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`
    },
    {
        language: 'rust',
        content: `fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    println!("Sum: {}", sum);
}`
    },
    {
        language: 'typescript',
        content: `interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
}

function getUser(id: number): User {
  return { id, name: "Alice", role: "admin" };
}`
    },
    {
        language: 'react',
        content: `const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
};`
    }
];
