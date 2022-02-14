const files = import.meta.globEager("./*.vue");

const modules: any = {};

for (const key in files) {
    if (Object.prototype.hasOwnProperty.call(files, key)) {
        modules[key.replace(/(\.\/|\.vue)/g, '')] = files[key].default
    }
}

export default modules;