export function removeItemFromArray(item: any, array) {
    let index = array.indexOf(item);
    if(index !== -1) { array.splice(index, 1) };
    return array;
}