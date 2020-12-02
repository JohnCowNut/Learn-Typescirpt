// Poject Type 
enum ProjectStatus { active, finished }
class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus) {

    }
}
// Projects State Management
// Type listener 
type Listener = (items: Project[]) => void;
class ProjectState {
    // create submition partten when something change at here
    private listeners: Listener[] = []
    private projects: Project[] = []
    private static instance: ProjectState
    private constructor() {

    }
    static getInstance() {
        if (this.instance) {
            return this.instance
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    // How to class add Project inside sumbit handle ProjectInput
    // How to update Project at Project List
    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.active)
        this.projects.push(newProject);

        // Call listenr func 
        for (const listenerFn of this.listeners) {
            // create shallow array not original array state 
            listenerFn(this.projects.slice())
        }

    }
    addListener(listenerFn: Listener) {
        console.log(listenerFn)
        this.listeners.push(listenerFn)
    }
}

const projectState = ProjectState.getInstance();


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
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;

}

// DECORATORS FOR BINDING 

function validate(validatableInput: Validatable) {
    let isValid = true;

    if (validatableInput.required) {
        if (typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.toString().trim().length !== 0
            // @params : true = true && false 
            // => false 
            // true  = true && true(1) 
            // => true(1)
        }
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max
    }
    return isValid
}
/**
 * === End: Validate
 */

// ProjectList Class 
class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    assignedProjects: Project[]
    constructor(private type: 'active' | 'finished') {
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        this.assignedProjects = []
        const importedNode = document.importNode(this.templateElement.content, true);
        // form Element  !v
        this.element = importedNode.firstElementChild as HTMLElement;

        this.element.id = `${type}-projects`;
        // resigter listener 
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if (this.type === 'active') {
                    return prj.status === ProjectStatus.active
                }
                return prj.status === ProjectStatus.finished
            })
            this.assignedProjects = relevantProjects;
            this.renderProject();
        })
        this.attach();
        this.renderContent();
    }
    private renderProject() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        // Prevent for duplicate content 
        listEl.innerHTML = ''
        for (const prjItem of this.assignedProjects) {
            const listItem = document.createElement('li');
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem)
        }
    }
    private renderContent() {
        const listID = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listID
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
    }

    private attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element)
    }
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
            // Create Project 
            projectState.addProject(title, desc, people)

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

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
        }
        const descriptionValidate: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidate: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        }
        // Solution 
        // @params : validate ({value: enteredTitle,required: true, minLength: 5})
        if (!validate(titleValidatable) || !validate(peopleValidate) || !validate(descriptionValidate)) {
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
const activePrjList = new ProjectList('active')
const finishedPrjList = new ProjectList('finished')