// Decorator
function AutoBind(_: any, _2: string | Symbol, description: PropertyDescriptor) {

    const originalMethod = description.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            return originalMethod.bind(this)
        }
    }
    return adjDescriptor
}
// Project Input
class ProjectInput {

    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleElementInput: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateElement.content, true);
        // form Element  !v
        this.element = importedNode.firstElementChild as HTMLFormElement;

        this.element.id = 'user-input'
        console.log(this.element)

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
        console.log(this.titleElementInput)
        console.log(this.titleElementInput.value)
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