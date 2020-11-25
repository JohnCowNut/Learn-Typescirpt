type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};
// Like Interface
//interface ElevatedEmployee extends Admin, Employee {}

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: "John",
  privileges: ["create-server"],
  startDate: new Date(),
};

type Combine = string | number;
type Numeric = number | boolean;

type Universal = Combine & Numeric;

// Type gard
function add(a: string, b: string): string;
function add(a: number, b: number): number;
function add(a: Combine, b: Combine) {
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}
const result = add("John", "sambi");
console.log(result.split(" "));

const fetchUserData = {
  id: "u1",
  name: "John",
  job: {
    title: "CEO",
    description: "My Own Company",
  },
};
console.log(fetchUserData?.job?.title);

const userInput = undefined;
// ?? null, undefined
const storedData = userInput ?? "Default";
console.log(storedData);
type UnknownEmployee = Employee | Admin;
function printEmployeeInformation(employee: UnknownEmployee) {
  console.log("Name", employee.name);
  if ("privileges" in employee) {
    console.log("Privileges", employee.privileges);
  }
}
// printEmployeeInformation(e1)

class Car {
  drive() {
    console.log("Driving ... ");
  }
}
class Truck {
  drive() {
    console.log("Driving  a trunk ");
  }

  loadCargo(amount: number) {
    console.log("Loading cargo ... " + amount);
  }
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Car();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}

useVehicle(v1);
useVehicle(v2);

interface Bird {
  flyingSpeed: number;
  type: "bird";
}

interface Horse {
  type: "horse";
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  let speed;
  switch (animal.type) {
    case "bird":
      speed = animal.flyingSpeed;
      break;
    case "horse":
      speed = animal.runningSpeed;
      break;
    default:
      return;
  }
  console.log("Moving with speed", speed);
}
moveAnimal({ type: "bird", flyingSpeed: 200 });

const userInputElement = document.getElementById(
  "user-input"
) as HTMLInputElement;

userInputElement.value = "hi there";

interface ErrorContainer {
  // {email: 'Not invalid email', userName:'Must start with characters'}
  [prop: string]: string;
}
const errorBag: ErrorContainer = {
  name: "Not a valid name",
  userName: "Must start with characters",
};
