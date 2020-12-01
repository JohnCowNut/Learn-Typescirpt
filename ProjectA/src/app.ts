// Decorator

/*
* === Start:  (1):Auto Bind ===
*/
function AutoBind(_: any, _2: string | Symbol, description: PropertyDescriptor) {

    const originalMethod = description.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        // try access the function at bottom 
        get() {
            return originalMethod.bind(this)
        }
    }
    return adjDescriptor
}
/**
 * End Auto bind 
 */


/* === Start:  Validate=== */
interface ValidatorConfig {
    [property: string]: {
        [validatableProp: string]: string[] // ['required', 'positive']
    }
}
// DECORATORS FOR BINDING 
const registeredValidators: ValidatorConfig = {}
function Required(target: any, propertyName: string) {
    console.log("=== (1) ===  Required")

    registeredValidators[target.constructor.name] = {
        ...registeredValidators[target.constructor.name],
        [propertyName]: ['required']
    }
}
function validate(obj: any) {
    const objValidateConfig = registeredValidators[obj.constructor.name];
    if (!objValidateConfig) {
        return true;
    }
    let isValid = true;

    for (const prop in objValidateConfig) {
        for (const validator of objValidateConfig[prop]) {

            switch (validator) {
                case 'required':
                    isValid = isValid && !!obj[prop]
                    break;
            }
        }
    }
    return isValid;
}
/**
 * === End: Validate
 */


// Project Input
class ProjectInput {

    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    @Required
    titleElementInput: HTMLInputElement;
    @Required
    descriptionInputElement: HTMLInputElement;
    @Required
    peopleInputElement: HTMLInputElement;
    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        // form Element  !v
        this.element = importedNode.firstElementChild as HTMLFormElement;

        this.element.id = 'user-input'


        this.titleElementInput = this.element.querySelector('#title')! as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;
        this.configure()
        this.attach()
    }
    @AutoBind
    private submitHandler(event: Event) {
        // prevent default submission 
        event.preventDefault();
        const userInput = this.gatherUserInput();
        // check if userInput is Tuple
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(title, desc, people)
            this.clearInputs()
        }
    }
    private clearInputs() {
        this.titleElementInput.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';

    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleElementInput.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const obj = {
            titleElementInput: enteredTitle,
            descriptionInputElement: enteredDescription,
            peopleInputElement: enteredPeople
        }
        if (validate(obj)) {
            alert('Invalid Input Please Try Again');
            return;
        } else {
            // convert to tuple +enteredPeople to number by +
            return [enteredTitle, enteredDescription, +enteredPeople]
        }

    }

    private configure() {
        // set up event listener
        // @params: đây cũng là 1 một cách nhưng chúng ta đã học decorators rồi thì phải chiến thôi hêh 
        //this.element.addEventListener('submit', this.submitHandler.bind(this))
        this.element.addEventListener('submit', this.submitHandler)

    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element)
    }
}
const test1 = new ProjectInput()