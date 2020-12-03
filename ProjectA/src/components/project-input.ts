namespace App {
    export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {

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
}