"use strict";
const e1 = {
    name: "John",
    privileges: ["create-server"],
    startDate: new Date(),
};
function add(a, b) {
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
function printEmployeeInformation(employee) {
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
    loadCargo(amount) {
        console.log("Loading cargo ... " + amount);
    }
}
const v1 = new Car();
const v2 = new Car();
function useVehicle(vehicle) {
    vehicle.drive();
    if (vehicle instanceof Truck) {
        vehicle.loadCargo(1000);
    }
}
useVehicle(v1);
useVehicle(v2);
function moveAnimal(animal) {
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
const userInputElement = document.getElementById("user-input");
userInputElement.value = "hi there";
const errorBag = {
    name: "Not a valid name",
    userName: "Must start with characters",
};
//# sourceMappingURL=app.js.map