const names: Array<string> = ["John", "Sambi"];
// What is Generics

const promise: Promise<string> = new Promise((resole, reject) => {
  setTimeout(() => {
    resole("This is Done");
  }, 2000);
});

promise.then((data) => {
  data.split(" ");
});

function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}
const mergeObj = merge({ name: "John" }, { age: 30 });
console.log(mergeObj);

interface Lengthy {
  length: number;
}
function countAndDescription<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = "Got no value";
  if (element.length === 1) {
    descriptionText = `Got 1  elements`;
  } else if (element.length > 1) {
    descriptionText = `Got ${element.length} + element`;
  }
  return [element, descriptionText];
}
console.log(countAndDescription(["Sambi", "Thuong"]));

function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  return `Value: ${obj[key]}`;
}
// Problem extractAndConvert({}, 'name')
extractAndConvert({ name: "thuong" }, "name");

class DataStorage<T extends string | number | boolean> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    // add more this line want if T is not primitives type
    if (this.data.indexOf(item) === -1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1);
  }
  getItems() {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();

textStorage.addItem("John");
textStorage.addItem("Sambi");

console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();

// const objectStorage = new DataStorage<object>();

// objectStorage.addItem({ name: "Sambi" });
// objectStorage.addItem({ name: "Thuong" });
// objectStorage.removeItem({ name: "Sambi" });
// console.log(objectStorage.getItems());

// BONUS

interface CourseGoal {
  title: string;
  description: string;
  completeUtil: Date;
}
function createCourseGoal(obj: CourseGoal) {
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = obj.title;
  courseGoal.description = obj.description;
  courseGoal.completeUtil = obj.completeUtil;
  return courseGoal as CourseGoal;
}

const soName: Readonly<string[]> = ["sambi", "Thuong"];
