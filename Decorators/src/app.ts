function Logger(logString: string) {
    console.log('Logger Factory')
    return function (constructor: Function) {
        console.log(logString)
        console.log(constructor)
    }
}

function WithTemplate(template: string, hookId: string) {
    console.log('Template Factory')
    return function <T extends { new(...args: any[]): { name: string } }>
        (originalConstructor: T) {
        return class extends originalConstructor {
            constructor(..._: any[]) {
                super();
                const hookEl = document.getElementById(hookId);
                console.log('Template Rendering')
                if (hookEl) {
                    hookEl.innerHTML = template
                    hookEl.querySelector('h1')!.textContent = this.name
                }
            }
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
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    // automatic set this key word
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {

            const boundFn = originalMethod.bind(this);
            return boundFn
        }
    }
    return adjDescriptor
}
class Printer {
    message = 'This Work!';
    @Autobind
    showMessage() {
        console.log(this.message)
    }
}
const p = new Printer()
const button = document.querySelector('button')!;

button.addEventListener('click', p.showMessage)
// Show undefined because , the "this" is not ref the content

// Using decorators bind this

interface ValidatorConfig {
    [property: string]: {
        [validatableProp: string]: string[] // ['required', 'positive']
    }
}
// DECORATORS FOR BINDING 
const registeredValidators: ValidatorConfig = {}
function Required(target: any, propertyName: string) {
    console.log(target.constructor.name, "(1)")
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propertyName]: ['required']
    }
}
function PositiveNumber(target: any, propertyName: string) {
    console.log(target.constructor.name, "(2)")
    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propertyName]: ['positive']
    }

}
function validate(obj: any) {
    console.log(obj.constructor.name, "(3)")

    const objValidateConfig = registeredValidators[obj.constructor.name];
    if (!objValidateConfig) {
        return true;
    }
    let isValid = true;
    console.log(objValidateConfig, "(4)")
    for (const prop in objValidateConfig) {
        for (const validator of objValidateConfig[prop]) {

            switch (validator) {
                case 'required':
                    isValid = isValid && !!obj[prop]
                    break;
                case 'positive':
                    isValid = isValid && obj[prop] > 0
                    break;
            }
        }
    }
    return isValid;
}
class Course {
    @Required
    title: string;
    @PositiveNumber
    price: number;
    constructor(t: string, p: number) {
        this.title = t;
        this.price = p;

    }

}


const courseForm = document.querySelector('form')!;

courseForm.addEventListener('submit', event => {
    event.preventDefault();
    // @get Element 
    const titleEl = document.getElementById('title') as HTMLInputElement;
    const priceEl = document.getElementById('price') as HTMLInputElement;

    // @get Values 
    const title = titleEl.value;
    const price = +priceEl.value;
    // CÓ thể như này nhưng ý 
    // tưởng muốn là có decorator chạy trước rồi luôn trong class
    // if(title.trim().length > 0 || price <= 0 ) {

    // }
    // validate(createCourse)
    const createCourse = new Course(title, price)
    //  validate(createCourse) ?? check xem dc hay khong 
    if (!validate(createCourse)) {
        alert('Invalid input, please try again !')
        return;
    }
    console.log(createCourse)

})