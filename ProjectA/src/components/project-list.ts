namespace App {

    export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
}