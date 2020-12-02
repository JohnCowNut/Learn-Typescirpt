// Drag & Drop Interface 

interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;

}

interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}

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
class State<T> {
    protected listeners: Listener<T>[] = [];
    addListener(listenerFn: Listener<T>) {
        console.log(listenerFn)
        this.listeners.push(listenerFn)
    }
}
// Type listener 
type Listener<T> = (items: T[]) => void;
class ProjectState extends State<Project> {
    // create submition partten when something change at here
    private projects: Project[] = []
    private static instance: ProjectState
    private constructor() {
        super();
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
    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(prj => prj.id === projectId)
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners()
        }
    }
    private updateListeners() {
        for (const listenerFn of this.listeners) {
            // create shallow array not original array state 
            listenerFn(this.projects.slice())
        }
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
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    constructor(
        templateId: string
        , hostElementId: string
        , insertAtStart: boolean
        , newElementId?: string
    ) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;
        const importedNode = document.importNode(this.templateElement.content, true);
        // form Element  !v
        this.element = importedNode.firstElementChild as U;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    private attach(insertAtBeginning: boolean) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element)
    }
    abstract configure(): void;
    abstract renderContent(): void;
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable {
    private project: Project;
    get person() {
        if (this.project.people === 1) {
            return '1 person'
        } else {
            return `${this.project.people} persons`
        }
    }
    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false, project.id)
        this.project = project;
        this.configure();
        this.renderContent();
    }
    @AutoBind
    dragStartHandler(event: DragEvent) {
        event.dataTransfer!.setData('text/plain', this.project.id)
        // move element from A to B
        event.dataTransfer!.effectAllowed = 'move'
    }
    dragEndHandler(_: DragEvent) {
        console.log("End Drag")
    }
    configure() {
        this.element.addEventListener('dragstart', this.dragStartHandler)
        this.element.addEventListener('dragend', this.dragEndHandler)
    }
    renderContent() {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.person + ' assigned';
        this.element.querySelector('p')!.textContent = this.project.description
    }
}
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];
    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`);
        this.assignedProjects = []

        this.configure()
        this.renderContent();
    }
    @AutoBind
    dragOverHandler(event: DragEvent) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault(); // event drop must go 
            const listEl = this.element.querySelector('UL')!;
            listEl.classList.add('droppable')

        }
    }
    @AutoBind
    dropHandler(event: DragEvent) {
        const projId = event.dataTransfer!.getData("text/plain");
        projectState.moveProject(
            projId,
            this.type === 'active' ? ProjectStatus.active : ProjectStatus.finished
        )

    }
    @AutoBind
    dragLeaveHandler(_: DragEvent) {
        const listEl = this.element.querySelector('UL')!;
        listEl.classList.remove('droppable')
    }
    renderContent() {
        const listID = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listID
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS'
    }
    private renderProject() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        // Prevent for duplicate content 
        listEl.innerHTML = ''
        for (const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem)

        }
    }
    configure() {
        // resigter listener 
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dropHandler)
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
    }

}
// Project Input
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {

    titleElementInput: HTMLInputElement;

    descriptionInputElement: HTMLInputElement;

    peopleInputElement: HTMLInputElement;
    constructor() {
        super('project-input', 'app', true, 'user-input')


        this.titleElementInput = this.element.querySelector('#title')! as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;
        this.configure()
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
    renderContent() { }

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

    configure() {
        // set up event listener
        // @params: đây cũng là 1 một cách nhưng chúng ta đã học decorators rồi thì phải chiến thôi hêh 
        //this.element.addEventListener('submit', this.submitHandler.bind(this))
        this.element.addEventListener('submit', this.submitHandler)

    }

}
const test1 = new ProjectInput()
const activePrjList = new ProjectList('active')
const finishedPrjList = new ProjectList('finished')