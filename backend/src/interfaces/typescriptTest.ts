type Extract<T, U> = T extends U ? T : never;
type Exclude<T, U> = T extends U ? never : T; //when leftSide of extends is union it will loop through it
type a = Exclude<'a' | 'b' | 'c', 'a'>;
type b = Extract<'a' | 'b' | 'c', 'a' | 'b'>;

//return type
type ReturnType<T> = T extends (...arg: any[]) => infer K ? K : never;
type abc = ReturnType<() => ['a', 'b', 'c', 'd', 'e', 'f']>;

//type
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT'];
type Length<T extends any[]> = T['length'];
type teslaLength = Length<spaceX>;

//return from promise
type promiseReturn<T extends Promise<unknown>> = T extends Promise<infer type>
	? type extends Promise<unknown>
		? promiseReturn<type>
		: type
	: never;
type prom = promiseReturn<Promise<Promise<string>>>;

//if
type If<T extends boolean, X, Y> = T extends true ? X : Y;
type A = If<true, 'a', 'b'>; // expected to be 'a'
type B = If<false, 'a', 'b'>; // expected to be 'b'

//equal
type Equal<T, K> = K extends T ? true : false;
type equal = Equal<'a', 'a'>;

//includes
// type Includes<T extends any[], K, j = T[number]> = K extends j ? true : false;
// type a = Equal<'a' | 'a'>
type Includes<T extends any[], K> = T extends [infer first, ...infer Rest]
	? Equal<first, K> extends true
		? true
		: Includes<Rest, K>
	: false;
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Kars'>; // expected to be `false`

// Exclude Array
type ExcludeArray<T extends any[], K, J extends any[] = []> = T extends [infer first, ...infer Rest]
	? Equal<first, K> extends false
		? ExcludeArray<Rest, K, [...J, first]>
		: ExcludeArray<Rest, K, [...J]>
	: J;
type excludeArray = ExcludeArray<['a', 'b', 'c', 'd'], 'c'>;

//push
type Push<T extends Array<unknown>, U> = [...T, U];
type pushArray = Push<['a', 'b'], 'c'>;

//unshift
type Unshift<T extends any[], K> = [K, ...T];
type unshift = Unshift<[1, 2], 0>; // [0, 1, 2,]

//concat
type Concat<T extends Array<unknown>, U extends Array<unknown>> = [...T, ...U];
type Result = Concat<[1], [2]>; // expected to be [1, 2]

//parameter
type Parameter<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;
type paraMeterCheck = Parameter<(a: string, b: string) => void>;

//pick
type MyPick<T extends Object, K extends keyof T> = {
	[key in K]: T[key];
};
interface Todo {
	title: string;
	description: string;
	completed: boolean;
}
type TodoPick = MyPick<Todo, 'title' | 'completed'>;

//Readonly
type MyReadonly<T> = {
	readonly [K in keyof T]: T[K];
};
interface TodoRead {
	title: string;
	description: string;
}

const todoRead: MyReadonly<TodoRead> = {
	title: 'Hey',
	description: 'foobar',
};

// todoRead.title = 'Hello'; // Error: cannot reassign a readonly property
// todoRead.description = 'barFoo'; // Error: cannot reassign a readonly property

//Tuple to Object
export type TupleToObject<T extends readonly any[]> = {
	[K in T[number]]: K;
};
const tuple = ['tesla 1', 'model 3', 'model X', 'model Y'] as const;
type result = TupleToObject<typeof tuple>; // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}

//first of array
type FirstResult<T> = T extends [infer first, ...infer Rest] ? first : never;
type arr1 = ['a', 'b', 'c'];
type arr2 = [3, 2, 1];

type head1 = FirstResult<arr1>; // expected to be 'a'
type head2 = FirstResult<arr2>; // expected to be 3

//OMIT
type MyOmit<T, K extends keyof T> = {
	[key in Exclude<keyof T, K>]: T[key];
};
// type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;
interface TodoOmit {
	title: string;
	description: string;
	completed: boolean;
}

type OmitTodo = MyOmit<TodoOmit, 'description' | 'title'>;

const todo: OmitTodo = {
	completed: false,
};
export {};
