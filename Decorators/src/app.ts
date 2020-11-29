function Logger(logString: string) {
    console.log('Logger Factory')
    return function (constructor: Function) {
        console.log(logString)
        console.log(constructor)
    }
}

function WithTemplate(template: string, hookId: string) {
    console.log('Template Factory')
    return function (constructor: any) {
        const hookEl = document.getElementById(hookId);
        console.log('Template Rendering')
        const p = new constructor();
        if (hookEl) {
            hookEl.innerHTML = template
            hookEl.querySelector('h1')!.textContent = p.name
        }
    }
}
@Logger('Hello world') // Bottom up
// Order decorator
@WithTemplate('<h1>My Personal Object</h1>', 'app')
class Person {
    name = 'John';
    constructor() {
        console.log('Creating person object ...')
    }
}

const pers = new Person()
console.log(pers)

// 0===========
// Nếu add vào trong class nhận 2 agument
function Log(target: any, propertyName: string | Symbol) {
    console.log("Property decorator Running !!")
    console.log(target, propertyName)

}
// Log 2 and Log 3 different methods 
function Log2(target: any, name: string, description: PropertyDescriptor) {
    console.log('======(2)========')
    console.log('Accessor decorator');
    console.log(target);
    console.log(name)
    console.log(description)

}
function Log3(target: any, name: string, description: PropertyDescriptor) {
    console.log('======(3)========')
    console.log('Methods decorator');
    console.log(target);
    console.log(name)
    console.log(description)
}
function Log4(target: any, name: string | Symbol, position: number) {
    console.log('======(4)========')
    console.log('Parameter decorator');
    console.log(target);
    console.log(name)
    console.log(position)
}


class Product {
    @Log
    title: string;
    private _price: number
    constructor(t: string, p: number) {
        this.title = t;
        this._price = p;

    }

    @Log2
    set price(val: number) {
        if (val > 0) {
            this._price = val;
        } else {
            throw new Error('Invalid price - should be positive')
        }
    }

    @Log3
    getPriceWithTax(@Log4 tax: number) {
        return this._price + (1 + tax)
    }


}
// ORDER IN CLASS  // execution define the class
const p1 = new Product('Book', 19)
const p2 = new Product('Book2 ', 32)