// Type listener 
import { Project, ProjectStatus } from '../models/project.js'

type Listener<T> = (items: T[]) => void;
class State<T> {
    protected listeners: Listener<T>[] = [];
    addListener(listenerFn: Listener<T>) {
        console.log(listenerFn)
        this.listeners.push(listenerFn)
    }
}
export class ProjectState extends State<Project> {
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

export const projectState = ProjectState.getInstance();


