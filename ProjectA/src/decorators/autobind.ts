namespace App {
    export function AutoBind(_: any, _2: string | Symbol, description: PropertyDescriptor) {

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

}